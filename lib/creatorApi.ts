import axios from "axios";
import { Transaction } from "@mysten/sui/transactions";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";

const KRILL_PACKAGE_ID = process.env.NEXT_PUBLIC_SEAL_PACKAGE_ID;

/**
 * Creator의 CreatorFileManager 존재를 보장하고, 그 ID를 반환합니다.
 * 1. 백엔드 API를 통해 FileManager의 존재 여부를 확인합니다.
 * 2. 존재하지 않으면, `create_file_manager` Move 함수를 호출하여 생성합니다.
 * 3. 생성된 managerId를 백엔드 API에 저장합니다.
 * 4. 최종적으로 managerId를 반환합니다.
 *
 * @param creatorAddress - 크리에이터의 Sui 주소
 * @param signAndExecute - 트랜잭션 서명 및 실행을 위한 dapp-kit 훅
 * @returns CreatorFileManager의 objectId
 */
export async function ensureCreatorManager(
  creatorAddress: string,
  signAndExecute: (payload: {
    transaction: Transaction;
    options?: any;
  }) => Promise<SuiTransactionBlockResponse>
): Promise<string> {
  if (!KRILL_PACKAGE_ID) {
    throw new Error("NEXT_PUBLIC_KRILL_PACKAGE_ID is not defined in .env.local");
  }

  // 1. API로 FileManager 존재 확인
  const { data } = await axios.get(`/api/creator/${creatorAddress}`);

  if (data.exists && data.managerId) {
    console.log("CreatorFileManager already exists:", data.managerId);
    return data.managerId;
  }

  // 2. 없으면 create_file_manager 트랜잭션 실행
  console.log("CreatorFileManager not found. Creating a new one...");
  const tx = new Transaction();
  tx.moveCall({
    target: `${KRILL_PACKAGE_ID}::file_nft::create_file_manager`,
    arguments: [], // 생성자는 보통 sender를 사용하므로 별도 인자 필요 없음
  });

  const result = await signAndExecute({
    transaction: tx,
    options: { showObjectChanges: true },
  });

  // 3. 새로 생성된 managerId 추출
  const createdObject = result.objectChanges?.find(
    (change: any) =>
      change.type === "created" &&
      change.objectType.endsWith("::file_nft::CreatorFileManager")
  );

  if (!createdObject || !createdObject.objectId) {
    throw new Error("Failed to find created CreatorFileManager objectId from transaction result.");
  }
  const managerId = createdObject.objectId;
  console.log("New CreatorFileManager created:", managerId);

  // 4. API를 통해 새 managerId 저장
  await axios.post("/api/creator", { address: creatorAddress, managerId });
  console.log("New managerId has been saved to the backend.");

  return managerId;
}

/**
 * `create_file_nft` Move 함수를 호출하는 트랜잭션을 생성합니다.
 * @param managerId - CreatorFileManager의 objectId
 * @param fileMeta - 파일 메타데이터
 * @returns 생성된 Transaction 객체
 */
export function createFileNftTransaction(managerId: string, fileMeta: any): Transaction {
  if (!KRILL_PACKAGE_ID) {
    throw new Error("NEXT_PUBLIC_KRILL_PACKAGE_ID is not defined in .env.local");
  }

  const tx = new Transaction();
  tx.moveCall({
    target: `${KRILL_PACKAGE_ID}::file_nft::create_file_nft`,
    arguments: [
      tx.object(managerId),
      tx.pure.string(fileMeta.title),
      tx.pure.string(fileMeta.description),
      tx.pure.string(fileMeta.blobId), // walrus blob id
      tx.pure.string(fileMeta.sealId), // seal id
      tx.pure.string(fileMeta.file.type),
      tx.pure.u64(fileMeta.file.size),
      tx.object("0x6"), // Clock
    ],
  });
  return tx;
}

