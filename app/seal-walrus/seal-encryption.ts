import axios from "axios";
import { SEAL_CONFIG } from "./config";

export class SealEncryption {
  private endpoint: string;

  constructor() {
    this.endpoint = SEAL_CONFIG.endpoint;
  }

  // Encrypt data with Seal
  async encryptData(
    data: ArrayBuffer,
    recipientPublicKeys: string[]
  ): Promise<{
    encryptedData: string;
    encryptionKey: string;
    nonce: string;
  }> {
    try {
      // Convert ArrayBuffer to base64
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(data)));

      const response = await axios.post(`${this.endpoint}/encrypt`, {
        data: base64Data,
        recipients: recipientPublicKeys,
        policy: {
          type: "threshold",
          threshold: 1,
        },
      });

      return {
        encryptedData: response.data.encryptedData,
        encryptionKey: response.data.encryptionKey,
        nonce: response.data.nonce,
      };
    } catch (error) {
      console.error("Seal encryption error:", error);
      throw new Error("Failed to encrypt with Seal");
    }
  }

  // Decrypt data with Seal
  async decryptData(
    encryptedData: string,
    encryptionKey: string,
    nonce: string,
    privateKey: string
  ): Promise<ArrayBuffer> {
    try {
      const response = await axios.post(`${this.endpoint}/decrypt`, {
        encryptedData,
        encryptionKey,
        nonce,
        privateKey,
      });

      // Convert base64 back to ArrayBuffer
      const binaryString = atob(response.data.decryptedData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return bytes.buffer;
    } catch (error) {
      console.error("Seal decryption error:", error);
      throw new Error("Failed to decrypt with Seal");
    }
  }

  // Generate key pair
  async generateKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
  }> {
    try {
      const response = await axios.post(`${this.endpoint}/generate-keypair`);

      return {
        publicKey: response.data.publicKey,
        privateKey: response.data.privateKey,
      };
    } catch (error) {
      console.error("Seal key generation error:", error);
      throw new Error("Failed to generate key pair");
    }
  }
}
