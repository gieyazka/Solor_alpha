"use server";

import { createAdminClient } from "@/utils/appwrite";

export const deleteImageSolar = async (id: string) => {
  try {
    const { storage } = await createAdminClient();
    await storage.deleteFile(process.env.NEXT_PUBLIC_BUCKET_SOLAR!, id);
    return { ok: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { ok: false };
  }
};
