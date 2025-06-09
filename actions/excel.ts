"use server";
import axios from "axios";
import { google } from "googleapis";
import { readFileSync } from "fs";
import { event_schedule } from "@prisma/client";
import { eventProps } from "@/@type";
import { sendMessageToLine } from "./line";
const { GOOGLESHEET_API_KEY } = process.env;
const SPREADSHEET_ID = "1bDwByhG3NoqXQYmQ7FUq0eyJQf4_H4Gw7P4gkV7ljsQ";
const GID = "0"; // ถ้าเป็น Sheet อื่นให้เปลี่ยนค่า GID
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;
// console.log("SHEET_URL", SHEET_URL);
// ✅ ฟังก์ชันโหลดข้อมูลจาก Excel และแปลงเป็น JSON
export async function loadMasterData() {
  try {
    // console.log("📥 กำลังโหลดข้อมูลจาก OneDrive...");
    const response = await axios.get(SHEET_URL);
    let data = response.data;
    data = JSON.parse(data.substr(47).slice(0, -2));
    const headers = data.table.cols.map((col: any) => col.label);

    const jsonData = data.table.rows.map((row: any, index: any) => {
      let obj: Record<string, any> = {};
      row.c.forEach((cell: any, index: any) => {
        obj[headers[index]] = cell ? cell.v : ""; // กรองค่า null ออก
      });
      return obj;
    });
    // console.log("✅ โหลดข้อมูลสำเร็จ!");

    return jsonData;
  } catch (error: any) {
    console.error("❌ โหลดข้อมูลไม่สำเร็จ:", error.message);
    return [];
  }
}
export async function loadEvent() {
  try {
    // console.time("⏳ โหลดข้อมูลจาก OneDrive");
    // console.log("📥 กำลังโหลดข้อมูลจาก OneDrive...");
    const SHEET = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=1992953452`;
    const response = await axios.get(SHEET);
    let data = response.data;
    data = JSON.parse(data.substr(47).slice(0, -2));
    const headers = data.table.cols.map((col: any) => col.label);
    const jsonData = data.table.rows.map((row: any, index: any) => {
      let obj: Record<string, any> = {};
      row.c.forEach((cell: any, index: any) => {
        obj[headers[index]] = cell ? cell.v : ""; // กรองค่า null ออก
      });
      return obj;
    });
    // console.log("✅ โหลดข้อมูลสำเร็จ!");
    // console.timeEnd("⏳ โหลดข้อมูลจาก OneDrive");

    return jsonData;
  } catch (error: any) {
    console.error("❌ โหลดข้อมูลไม่สำเร็จ:", error.message);
    return [];
  }
}
export const testFn = async () => {
  // const raw = readFileSync("credentials.json", "utf8");
  // const base64 = Buffer.from(raw).toString("base64");
  // console.log("base64", base64);
};
export async function writeToSheet(data: eventProps) {
  try {
    const decoded = Buffer.from(GOOGLESHEET_API_KEY!, "base64").toString(
      "utf8"
    );

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(decoded),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = SPREADSHEET_ID; // 👈 จาก URL ของ Google Sheet
    const range = "การนัดหมาย"; // หรือ "ชื่อชีต!A1"

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            null,
            data.team,
            data.title,
            data.description,
            data.school_id,
            data.date,
          ],
        ],
      },
    });
    const plainResult = JSON.parse(JSON.stringify(res));
    sendMessageToLine(data);
    console.log("✅ เขียนข้อมูลลง Google Sheet สำเร็จ");
    return plainResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
