"use server";

import { createAdminClient } from "@/utils/appwrite";
import PrismaDB from "../db";
import { Query } from "node-appwrite";

export const getSurvey = async (props: { page: number; size: number }) => {
  console.log("getSurveyBySchoolId");
  const { page = 1, size = 10 } = props;
  const { database } = await createAdminClient();
  const survey = await database.listDocuments(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_SURVEY_COLLECTION_ID!,
    [
      Query.limit(size),
      Query.offset((page - 1) * size),
      Query.orderDesc("$createdAt"),
    ]
  );
  return survey;
};
