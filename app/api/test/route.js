import { NextResponse } from "next/server";
import { sendMessageToLine } from "@/actions/line";
import { loadMasterData, writeToSheet,testFn } from "@/actions/excel";
import { createAdminClient } from "@/utils/appwrite";

export async function GET(req) {
  try {
    // const appwrite = await createAdminClient();
    // const res = await appwrite.database.listDocuments(
    //   process.env.APPWRITE_DATABASE_ID,
    //   process.env.APPWRITE_SURVEY_COLLECTION_ID
    // );
    // console.log(res.documents[0].cabinet);
    return NextResponse.json({ error: "Test" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
