"use server";
import { AppwriteType, calendarProps } from "@/@type";

import { loadMasterData } from "./excel";
import { createAdminClient } from "@/utils/appwrite";
import { ID, Query } from "node-appwrite";

const {
  APPWRITE_DATABASE_ID: databaseId,
  APPWRITE_CALENDAR_COLLECTION_ID: calendarCollectionId,
} = process.env;

export const getAllCalendar = async () => {
  try {
    let page = 1;
    let perPage = 2000;
    let calendarData: AppwriteType<calendarProps>[] = [];
    while (true) {
      const { database } = await createAdminClient();
      const res = await database.listDocuments(
        databaseId!,
        calendarCollectionId!,
        [
          Query.limit(perPage),
          Query.offset((page - 1) * perPage),
          Query.equal("is_delete", false),
        ]
      );
      calendarData = calendarData.concat(
        res.documents as AppwriteType<calendarProps>[]
      );
      if (res.documents.length < perPage) break; // ถ
    }

    return calendarData as AppwriteType<calendarProps>[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function createCalendar(data: calendarProps) {
  try {
    const { database } = await createAdminClient();

    const createRes = await database.createDocument(
      databaseId!,
      calendarCollectionId!,
      ID.unique(),
      data
    );
    return createRes as AppwriteType<calendarProps>;
  } catch (error) {
    console.error("Error creating calendar:", data, error);
    // return error;
  }
}

export const updateCalendar = async (props: {
  id: string;
  data: Partial<calendarProps>;
}) => {
  const { id, data } = props;
  try {
    const { database } = await createAdminClient();

    const updateRes = await database.updateDocument(
      databaseId!,
      calendarCollectionId!,
      id,
      data
    );
    return updateRes;
  } catch (error) {
    console.error("Error updating school:", id, error);
    throw error;
  }
};

export const deleteCalendar = async (id: string) => {
  try {
    const { database } = await createAdminClient();

    const deleteRes = await database.updateDocument(
      databaseId!,
      calendarCollectionId!,
      id,
      { is_delete: true }
    );
    return deleteRes;
  } catch (error) {
    console.error("Error deleting calendar:", id, error);
    throw error;
  }
};
