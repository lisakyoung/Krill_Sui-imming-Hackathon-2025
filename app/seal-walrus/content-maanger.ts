import { WalrusClient } from "./walrus-client";
import { SealEncryption } from "./seal-encryption";
import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_CONFIG } from "./config";

export class ContentManager {
  private walrus: WalrusClient;
  private seal: SealEncryption;
  private suiClient: SuiClient;

  constructor() {
    this.walrus = new WalrusClient();
    this.seal = new SealEncryption();
    this.suiClient = new SuiClient({ url: SUI_CONFIG.rpcUrl });
  }

  // Upload encrypted content
  async uploadEncryptedContent(
    file: File,
    creatorAddress: string,
    allowedViewers: string[] = []
  ): Promise<{
    blobId: string;
    encryptionKey: string;
    nonce: string;
    txHash: string;
  }> {
    try {
      // 1. Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // 2. Encrypt with Seal
      const { encryptedData, encryptionKey, nonce } =
        await this.seal.encryptData(arrayBuffer, [
          creatorAddress,
          ...allowedViewers,
        ]);

      // 3. Create encrypted blob
      const encryptedBlob = new Blob([encryptedData], {
        type: "application/octet-stream",
      });
      const encryptedFile = new File([encryptedBlob], file.name, {
        type: "application/octet-stream",
      });

      // 4. Upload to Walrus
      const blobId = await this.walrus.uploadFile(encryptedFile);

      // 5. Store metadata on Sui
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${SUI_CONFIG.packageId}::evolution::create_content`,
        arguments: [
          tx.pure(file.name),
          tx.pure("Encrypted content"),
          tx.pure(blobId),
          tx.pure(100), // evolution threshold
          tx.pure(500), // creator fee
          tx.object("0x6"), // Clock
        ],
      });

      // Execute transaction (needs wallet integration)
      const txHash = "simulated_tx_hash"; // In production, use wallet to sign

      return {
        blobId,
        encryptionKey,
        nonce,
        txHash,
      };
    } catch (error) {
      console.error("Content upload error:", error);
      throw error;
    }
  }

  // Retrieve and decrypt content
  async retrieveDecryptedContent(
    blobId: string,
    encryptionKey: string,
    nonce: string,
    userPrivateKey: string
  ): Promise<Blob> {
    try {
      // 1. Retrieve from Walrus
      const encryptedBlob = await this.walrus.retrieveFile(blobId);

      // 2. Convert blob to ArrayBuffer
      const encryptedBuffer = await encryptedBlob.arrayBuffer();

      // 3. Convert ArrayBuffer to base64 for decryption
      const encryptedBase64 = btoa(
        String.fromCharCode(...new Uint8Array(encryptedBuffer))
      );

      // 4. Decrypt with Seal
      const decryptedBuffer = await this.seal.decryptData(
        encryptedBase64,
        encryptionKey,
        nonce,
        userPrivateKey
      );

      // 5. Create decrypted blob
      return new Blob([decryptedBuffer]);
    } catch (error) {
      console.error("Content retrieval error:", error);
      throw error;
    }
  }

  // Check access permission
  async checkAccess(contentId: string, userAddress: string): Promise<boolean> {
    try {
      // Query Sui blockchain for access rights
      const result = await this.suiClient.getObject({
        id: contentId,
        options: {
          showContent: true,
        },
      });

      // Check if user has access (simplified)
      return true; // In production, check actual on-chain permissions
    } catch (error) {
      console.error("Access check error:", error);
      return false;
    }
  }
}
