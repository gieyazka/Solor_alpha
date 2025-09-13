import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { readFile } from "fs/promises";
import path from "path";
import { SchoolData, SchoolProps } from "@/@type";
import { createSchool, deleteSchool, getAllSchool } from "@/actions/school";
import pMap from "p-map";

export async function GET() {
  // const schoolData = await getAllSchool();
  // await pMap(
  //   schoolData,
  //   async (school) => {
  //     await deleteSchool(school.$id);
  //   },
  //   { concurrency: 1 }
  // );

  // ตรวจสอบว่ามีข้อมูลหรือไม่

  return NextResponse.json("success");
}
