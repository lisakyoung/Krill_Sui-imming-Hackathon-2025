import type { SuiClient } from '@mysten/sui/client';
import { WalrusClient } from '@mysten/walrus';
import { WalrusFile } from '@mysten/walrus';
import type { Keypair } from '@mysten/sui/cryptography';

/**
 * SuiClient를 인자로 받아 WalrusClient 인스턴스를 생성합니다.
 * @param suiClient - dapp-kit의 useSuiClient() 훅으로 얻은 SuiClient 인스턴스
 */
export function createWalrusClient(suiClient: SuiClient) {
	return new WalrusClient({
		network: 'testnet',
		suiClient,
	});
}

// reading blobs
export const blob = async ( // 구독자가 맞으면 복호화
  walrusClient: WalrusClient,
  blobId:string,
) => {await walrusClient.readBlob({ blobId });}

/**
 * @deprecated This function requires a raw Keypair and is not suitable for dApp environments. Use createWalrusFileTransaction instead.
 */
export const file = async (file: Uint8Array, keypair: Keypair) => {};

/**
 * Connects to a wallet to upload a file to Walrus.
 * This handles the entire multi-step process: encoding, registering, uploading, and certifying.
 * @param fileContent The file content as a Uint8Array.
 * @param walrusClient The WalrusClient instance.
 * @param ownerAddress The address of the wallet that will own the blob.
 * @param signAndExecute A function from a wallet hook (e.g., `useSignAndExecuteTransaction`) to sign and execute transactions.
 * @returns The result of the final certification transaction.
 */
export const uploadFileToWalrus = async (
	walrusClient: WalrusClient,
	fileContent: Uint8Array,
	ownerAddress: string,
	signAndExecute: (payload: { transaction: any }) => Promise<any>,
) => {
	// 1. Create a WalrusFile and initialize the upload flow
	const flow = walrusClient.writeFilesFlow({
		files: [
			WalrusFile.from({
				contents: fileContent,
				// The identifier is required. You might want to make this dynamic (e.g., from a file name).
				identifier: 'uploaded-file',
			}),
		],
	});

	// 2. Encode the file to prepare for upload
	await flow.encode();

	// 3. Create and execute the registration transaction
	const registerTx = flow.register({ epochs: 3, owner: ownerAddress, deletable: true });
	console.log('1. Registering file...');
	const registerResult = await signAndExecute({ transaction: registerTx });
	console.log('File registered:', registerResult.digest);

	// 4. Upload the file to Walrus storage nodes
	console.log('2. Uploading file...');
	await flow.upload({ digest: registerResult.digest });
	console.log('File uploaded.');

	// 5. Create and execute the certification transaction
	const certifyTx = flow.certify();
	console.log('3. Certifying file...');
	const certifyResult = await signAndExecute({ transaction: certifyTx });
	console.log('File certified:', certifyResult.digest);

	// 6. Get the new file info
	const files = await flow.listFiles();
	console.log('Uploaded files info:', files);
  	console.log('blobId', files[0].blobId);
	return { files };
};

/**
 * Reads a file from Walrus using its ID (Blob ID or Quilt ID).
 * @param fileId The ID of the file to read.
 * @param walrusClient The WalrusClient instance.
 * @returns The file content as a Uint8Array.
 */
export const readFileFromWalrus = async (
	walrusClient: WalrusClient,
	fileId: string
): Promise<Uint8Array> => {
	console.log(`Reading file with ID: ${fileId}`);
	const [file] = await walrusClient.getFiles({ ids: [fileId] });

	if (!file) {
		throw new Error(`File with ID ${fileId} not found.`);
	}

	const content = await file.bytes();
	console.log(`Successfully read ${content.byteLength} bytes.`);
	return content;
};
