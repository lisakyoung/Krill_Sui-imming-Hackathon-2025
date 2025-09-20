import { useState } from "react";
import { ContentManager } from "@/lib/seal-walrus/content-manager";
import toast from "react-hot-toast";

export function useContentUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadContent = async (
    file: File,
    creatorAddress: string,
    onSuccess?: (data: any) => void
  ) => {
    setUploading(true);
    setProgress(0);

    try {
      const contentManager = new ContentManager();

      // Simulate progress
      setProgress(20);

      // Upload encrypted content
      const result = await contentManager.uploadEncryptedContent(
        file,
        creatorAddress
      );

      setProgress(100);

      toast.success("Content uploaded and encrypted successfully!");

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload content");
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadContent,
    uploading,
    progress,
  };
}
