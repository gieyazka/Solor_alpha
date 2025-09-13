import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { readFile } from "fs/promises";
import path from "path";
import { calendarProps, SchoolData, SchoolProps } from "@/@type";
import { createSchool } from "@/actions/school";
import pMap from "p-map";
import { CalendarProps } from "react-big-calendar";
import { createCalendar } from "@/actions/calendar";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "calendar.csv"); // หรือ data/schools.csv
  const csv = await readFile(filePath, "utf8");

  const records = parse(csv, {
    columns: (header) => header.map((h) => h.replace(/['"]/g, "").trim()), // แปลง header เป็น key
    skip_empty_lines: true,
    trim: true,
  }) as calendarProps[];

  const school = records[0]; // เก็บข้อมูลแถวแรกไว้ในตัวแปร school
  // console.log("school", school);
  await pMap(
    records,
    async (school) => {
      // console.log("school.activityArr", school.activityArr);
      const formattedSchool: calendarProps = {
        title: school["title"],
        description: school["description"],
        date: school["date"],
        school_id: parseInt(school["school_id"].toString()),
        team: school["team"],

      };

      // const res = await createCalendar(formattedSchool);
    },
    { concurrency: 3 }
  );

  // ตรวจสอบว่ามีข้อมูลหรือไม่

  return NextResponse.json("success");
}
