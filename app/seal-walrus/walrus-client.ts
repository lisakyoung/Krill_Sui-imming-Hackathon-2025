import axios from "axios";
import { WALRUS_CONFIG } from "./config";

export class WalrusClient {
  private publisher: string;
  private aggregator: string;

  constructor() {
    this.publisher = WALRUS_CONFIG.publisher;
    this.aggregator = WALRUS_CONFIG.aggregator;
  }

  // Upload file to Walrus
  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.put(
        `${this.publisher}/v1/store?epochs=${WALRUS_CONFIG.epochs}`,
        file,
        {
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      if (response.data.newlyCreated) {
        return response.data.newlyCreated.blobObject.blobId;
      } else if (response.data.alreadyCertified) {
        return response.data.alreadyCertified.blobId;
      }

      throw new Error("Failed to get blob ID from Walrus");
    } catch (error) {
      console.error("Walrus upload error:", error);
      throw new Error("Failed to upload to Walrus");
    }
  }

  // Retrieve file from Walrus
  async retrieveFile(blobId: string): Promise<Blob> {
    try {
      const response = await axios.get(`${this.aggregator}/v1/${blobId}`, {
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      console.error("Walrus retrieve error:", error);
      throw new Error("Failed to retrieve from Walrus");
    }
  }

  // Get blob metadata
  async getBlobMetadata(blobId: string): Promise<any> {
    try {
      const response = await axios.head(`${this.aggregator}/v1/${blobId}`);

      return {
        size: response.headers["content-length"],
        type: response.headers["content-type"],
        status: response.status,
      };
    } catch (error) {
      console.error("Walrus metadata error:", error);
      throw new Error("Failed to get blob metadata");
    }
  }
}
