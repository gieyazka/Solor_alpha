import { NextResponse } from "next/server";
import { sendMessageToLine } from "@/actions/line";
import { loadMasterData, writeToSheet, testFn } from "@/actions/excel";

export async function GET(req) {
  try {
    const data = await getMaster();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
