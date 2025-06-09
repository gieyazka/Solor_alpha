import { NextResponse } from "next/server";
// import { sendMessageToLine } from "@/actions/line";

export async function GET(req) {
  try {
    // const res = sendMessageToLine("Test");
    // console.log("res", res);
    // return NextResponse.json({ data: res }, { status: 200 });
    return NextResponse.json({ error: "Test" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
