import { useEffect, useMemo, useState } from "react";
import { ConnectButton, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import Link from "next/link";

type TierInfo = {
  tierId: number;
  name: string;
  description: string;
  price: string;          // u64 문자열
  maxSubscribers: string; // u64 문자열
};

export default function CreatorContents() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient(); // dapp-kit 제공(프로바이더에 설정된 fullnode 사용)
  const [packageId, setPackageId] = useState(
    "0x38311979dc9eb826a71719cd4c87927e397646032d57ea3831143f622408260c"
  );

  const type = useMemo(() => {
    const base = packageId;
    return {
      fileNFT: `${base}::file_nft::FileNFT`,
      fileManager: `${base}::file_nft::CreatorFileManager`,
      subNFT: `${base}::sub_nft::SubNFT`,
      subManager: `${base}::sub_nft::CreatorSubManager`,
    };
  }, [packageId]);

  const [loading, setLoading] = useState(false);
  const [fileManagerIds, setFileManagerIds] = useState<string[]>([]);
  const [subManagerIds, setSubManagerIds] = useState<string[]>([]);
  const [ownedFileNFTs, setOwnedFileNFTs] = useState<string[]>([]);
  const [ownedSubNFTs, setOwnedSubNFTs] = useState<string[]>([]);
  const [tiersByManager, setTiersByManager] = useState<Record<string, TierInfo[]>>({});

  const address = account?.address;

  async function queryManagersByCreator(
    client: SuiClient,
    structType: string,
    creatorAddr: string
  ): Promise<string[]> {
    // StructType으로 오브젝트 검색 → 컨텐츠 안의 fields.creator가 로그인 주소와 같은 것만 필터링
    try {
      const res = await client.getOwnedObjects({
        owner: creatorAddr,
        filter: { StructType: structType },
        options: { showContent: true, showType: true },
      });

      const ids = res.data
        ?.filter((obj: any) => {
          const content = obj.data?.content as any;
          const fields = content?.fields;
          return fields?.creator?.toLowerCase?.() === creatorAddr.toLowerCase();
        })
        .map((obj: any) => obj.data?.objectId as string)
        .filter(Boolean) ?? [];

      return ids;
    } catch (error) {
      console.error(`Error querying ${structType}:`, error);
      return [];
    }
  }

  async function queryOwnedType(client: SuiClient, ownerAddr: string, structType: string): Promise<string[]> {
    // 소유 오브젝트 중 특정 타입 필터
    const res = await client.getOwnedObjects({
      owner: ownerAddr,
      filter: { StructType: structType },
      options: { showType: true },
    });
    return res.data.map((o) => o.data?.objectId!).filter(Boolean);
  }

  async function readTiersFromSubManager(client: SuiClient, managerId: string): Promise<TierInfo[]> {
    // 1) CreatorSubManager 가져와서 tiers 테이블 오브젝트 ID 찾기
    const obj = await client.getObject({
      id: managerId,
      options: { showContent: true },
    });
    const content: any = obj.data?.content;
    const tiersTableId: string | undefined = content?.fields?.tiers?.fields?.id?.id;

    if (!tiersTableId) return [];

    // 2) Dynamic fields(키 목록) 조회 → 키는 u8라서 이름이 바이트/숫자 표현으로 옴
    const keys = await client.getDynamicFields({ parentId: tiersTableId, limit: 200 });

    // 3) 각 키로 실제 SubTier 값을 가져오기
    const results: TierInfo[] = [];
    for (const k of keys.data) {
      try {
        const valueObj = await client.getDynamicFieldObject({
          parentId: tiersTableId,
          name: k.name, // 그대로 전달 (RPC가 내부에서 타입 해석)
        });

        // SubTier 구조체 파싱
        const content = valueObj.data?.content as any;
        const fields: any = content?.fields?.value?.fields;
        if (!fields) continue;

        results.push({
          tierId: Number(fields.tier_id),
          name: fields.name,
          description: fields.description,
          price: String(fields.price),
          maxSubscribers: String(fields.max_subscribers),
        });
      } catch (e) {
        // 키 삭제/레이스 등 무시
        console.warn("read tier failed:", e);
      }
    }
    // tierId 기준 정렬
    results.sort((a, b) => a.tierId - b.tierId);
    return results;
  }

  const runCheck = async () => {
    if (!address) return;
    setLoading(true);
    try {
      // 1) 내가 만든 매니저들 찾기
      const [fileMgrIds, subMgrIds] = await Promise.all([
        queryManagersByCreator(suiClient, type.fileManager, address),
        queryManagersByCreator(suiClient, type.subManager, address),
      ]);
      setFileManagerIds(fileMgrIds);
      setSubManagerIds(subMgrIds);

      // 2) 내가 가진 NFT들 찾기
      const [myFileNfts, mySubNfts] = await Promise.all([
        queryOwnedType(suiClient, address, type.fileNFT),
        queryOwnedType(suiClient, address, type.subNFT),
      ]);
      setOwnedFileNFTs(myFileNfts);
      setOwnedSubNFTs(mySubNfts);

      // 3) 각 SubManager의 tiers 테이블을 읽어 티어 목록 만들기
      const tiersEntries: Record<string, TierInfo[]> = {};
      for (const mid of subMgrIds) {
        tiersEntries[mid] = await readTiersFromSubManager(suiClient, mid);
      }
      setTiersByManager(tiersEntries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 주소가 바뀌면 자동 재조회는 선택. 수동 버튼으로만 하고 싶으면 주석 처리.
    // if (address) runCheck();
  }, [address]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">내 컨텐츠 확인</h1>
        <Link
          href="/creator-dashboard"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          크리에이터 대시보드로 이동
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ConnectButton />
        <input
          className="border px-3 py-2 rounded w-[680px]"
          placeholder="Package ID"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value.trim())}
        />
        <button
          onClick={runCheck}
          disabled={!address || loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "확인 중..." : "내 리소스 확인"}
        </button>
      </div>

      <section>
        <h2 className="font-semibold text-lg mb-2">내 매니저(공유 오브젝트)</h2>
        <div className="grid gap-2">
          <div>
            <div className="text-sm text-gray-500">CreatorFileManager</div>
            {fileManagerIds.length === 0 ? (
              <div className="text-red-600">없음</div>
            ) : (
              <ul className="list-disc pl-5">
                {fileManagerIds.map((id) => (
                  <li key={id} className="font-mono text-sm">{id}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-500">CreatorSubManager</div>
            {subManagerIds.length === 0 ? (
              <div className="text-red-600">없음</div>
            ) : (
              <ul className="list-disc pl-5">
                {subManagerIds.map((id) => (
                  <li key={id} className="font-mono text-sm">{id}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">내가 보유한 NFT</h2>
        <div className="grid gap-2">
          <div>
            <div className="text-sm text-gray-500">FileNFT</div>
            {ownedFileNFTs.length === 0 ? (
              <div className="text-red-600">없음</div>
            ) : (
              <ul className="list-disc pl-5">
                {ownedFileNFTs.map((id) => (
                  <li key={id} className="font-mono text-sm">{id}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-500">SubNFT</div>
            {ownedSubNFTs.length === 0 ? (
              <div className="text-red-600">없음</div>
            ) : (
              <ul className="list-disc pl-5">
                {ownedSubNFTs.map((id) => (
                  <li key={id} className="font-mono text-sm">{id}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">내 티어 (CreatorSubManager.tiers)</h2>
        {subManagerIds.length === 0 ? (
          <div className="text-gray-600">SubManager가 없어서 조회할 티어가 없어요.</div>
        ) : (
          subManagerIds.map((mid) => (
            <div key={mid} className="border rounded p-3 mb-3">
              <div className="font-mono text-sm mb-2">{mid}</div>
              {(tiersByManager[mid] ?? []).length === 0 ? (
                <div className="text-gray-600">티어 없음</div>
              ) : (
                <ul className="list-disc pl-5">
                  {(tiersByManager[mid] ?? []).map((t) => (
                    <li key={t.tierId}>
                      <div className="font-semibold">
                        #{t.tierId} — {t.name} (price: {t.price}, max: {t.maxSubscribers})
                      </div>
                      <div className="text-sm text-gray-600">{t.description}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
