"use server";
import { AppwriteType, SchoolData, SchoolProps } from "@/@type";

import { loadMasterData } from "./excel";
import { createAdminClient } from "@/utils/appwrite";
import { ID, Query } from "node-appwrite";

const {
  APPWRITE_DATABASE_ID: databaseId,
  APPWRITE_SCHOOL_COLLECTION_ID: schoolCollectionId,
} = process.env;

export const getAllSchool = async () => {
  try {
    let page = 1;
    let perPage = 2000;
    let schoolData: AppwriteType<SchoolProps>[] = [];
    while (true) {
      const { database } = await createAdminClient();
      const res = await database.listDocuments(
        databaseId!,
        schoolCollectionId!,
        [Query.limit(perPage), Query.offset((page - 1) * perPage)]
      );
      schoolData = schoolData.concat(
        res.documents as unknown as AppwriteType<SchoolProps>[]
      );
      if (res.documents.length < perPage) break; // ถ
    }

    return schoolData as AppwriteType<SchoolProps>[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function getLastestId() {
  try {
    const { database } = await createAdminClient();
    const res = await database.listDocuments(databaseId!, schoolCollectionId!, [
      Query.limit(1),
      Query.orderDesc("id"),
    ]);
    return (res.documents[0]?.id as number) || null;
  } catch (error) {
    console.error("Error getting latest school ID:", error);
    throw error;
  }
}

export async function createSchool(data: SchoolProps) {
  try {
    const { database } = await createAdminClient();

    const createRes = await database.createDocument(
      databaseId!,
      schoolCollectionId!,
      ID.unique(),
      data
    );
    console.log("done", data.id);
    return createRes as unknown as AppwriteType<SchoolProps>;
  } catch (error) {
    console.error("Error creating school:", data.id, error);
    // return error;
  }
}

export const updateSchool = async (props: {
  id: string;
  data: Partial<SchoolProps>;
}) => {
  const { id, data } = props;
  try {
    const { database } = await createAdminClient();

    const updateRes = await database.updateDocument(
      databaseId!,
      schoolCollectionId!,
      id,
      data
    );
    console.log("done", id);
    return updateRes as unknown as AppwriteType<SchoolProps>;
  } catch (error) {
    console.error("Error updating school:", id, (error as Error).message);
    throw error;
  }
};

export const deleteSchool = async (id: string) => {
  try {
    const { database } = await createAdminClient();

    const deleteRes = await database.deleteDocument(
      databaseId!,
      schoolCollectionId!,
      id
    );
    return deleteRes;
  } catch (error) {
    console.error("Error deleting school:", id, error);
    throw error;
  }
};
