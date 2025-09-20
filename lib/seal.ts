import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { SealClient, SessionKey } from "@mysten/seal";
import type { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex, toBase64 } from "@mysten/sui/utils"
import { useCallback, useState } from "react";

// mysten testnet key server objectId
const serverObjectIds = [
    "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75", 
    "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8"
];

/**
 * SuiClient를 인자로 받아 SealClient 인스턴스를 생성합니다.
 * @param suiClient - dapp-kit의 useSuiClient() 훅으로 얻은 SuiClient 인스턴스
 */
export function createSealClient(suiClient: SuiClient) {
  return new SealClient({
      suiClient,
      serverConfigs: serverObjectIds.map((id) => ({ objectId: id, weight: 1 })),
      verifyKeyServers: false,
  });
}

// 입력 받은 사진 파일을 Uint8Array 형식으로 전환
export const imageToBytes = async (file: File) => { 
  const buffer = await file.arrayBuffer();
  //Uint8Array로 변환
  const fileArray = new Uint8Array(buffer);

  return fileArray;
}

// 변환한 사진 데이터를 data로 입력
// 암호화
export const encryptWithSeal = async ( // 콘텐츠를 암호화
  sealClient: SealClient,
  packageId: string,
  id: string,
  data: Uint8Array
) => {
  const { encryptedObject, key } = await sealClient.encrypt({
    threshold: 2,
    packageId,
    id,
    data,
  })

  return { encryptedObject, key }; // Uint8Array
}

// 세션키 연장하는 함수
/** 1) 커스텀 훅: 세션키 초기화 */
function useSessionKey(suiClient: SuiClient, packageIdHex: string) {
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  const currentAccount = useCurrentAccount();
  const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const init = useCallback(async () => {
    if (!currentAccount) throw new Error("지갑이 연결되어 있지 않습니다.");
    setLoading(true);
    setError(null);
    try {
      // SessionKey 생성 (packageId는 base16→base64로 변환)
      const sk = await SessionKey.create({
        address: currentAccount.address,
        packageId: toBase64(fromHex(packageIdHex)),
        ttlMin: 10,
        suiClient,
      });

      // 서명할 메시지 가져오기 (Uint8Array)
      const message = sk.getPersonalMessage();

      // dapp-kit 훅으로 개인메시지 서명
      const { signature } = await signPersonalMessage({ message });

      // 세션키에 서명 세팅
      sk.setPersonalMessageSignature(signature);

      setSessionKey(sk);
      return sk;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [currentAccount, packageIdHex, signPersonalMessage, suiClient]);

  return { sessionKey, init, loading, error };
}

/** 2) 헬퍼: seal_approve 호출 트랜잭션 만들고 복호화 */
async function decryptWithSeal(opts: {
  suiClient: SuiClient;
  packageIdHex: string;
  moduleName: string;
  idHex: string;                 // seal identity (hex)
  encryptedBytes: Uint8Array;    // 암호문
  sessionKey: SessionKey;
  sealClient: SealClient;
}) {
  const { suiClient, packageIdHex, moduleName, idHex, encryptedBytes, sessionKey, sealClient } = opts;

  // seal_approve 호출 트랜잭션 (onlyTransactionKind)
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageIdHex}::${moduleName}::seal_approve`,
    arguments: [
      tx.pure.vector("u8", fromHex(idHex)), // 첫번째 인자는 identity 벡터<u8>
      // 필요한 추가 인자 있으면 여기에 tx.pure.* 로 넣기
    ],
  });

  const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });

  // 복호화
  const decrypted = await sealClient.decrypt({
    data: encryptedBytes,
    sessionKey,
    txBytes,
  });

  return decrypted; // Uint8Array
}