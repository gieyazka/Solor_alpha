import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { readFile } from "fs/promises";
import path from "path";
import { SchoolData, SchoolProps } from "@/@type";
import { createSchool } from "@/actions/school";
import pMap from "p-map";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "Masterdata.csv"); // หรือ data/schools.csv
  const csv = await readFile(filePath, "utf8");

  const records = parse(csv, {
    columns: (header) => header.map((h) => h.replace(/['"]/g, "").trim()), // แปลง header เป็น key
    skip_empty_lines: true,
    trim: true,
  }) as SchoolData[];

  const school = records[0]; // เก็บข้อมูลแถวแรกไว้ในตัวแปร school
  // console.log("school", school);
  await pMap(
    records,
    async (school) => {
      // console.log("school.activityArr", school.activityArr);
      const formattedSchool: SchoolProps = {
        id: parseInt(school["id"]),
        no: parseInt(school["ลำดับ"]),
        solarEst: parseFloat(school["ประมาณการติดตั้ง Solar cell"]),
        location_checked:
          school["ตรวจสอบสถานที่"] === "YES"
            ? true
            : school["ตรวจสอบสถานที่"] === "NO"
            ? false
            : undefined,
        kw_pk: parseFloat(school["KW_PK"].toString()),
        school_name: school["ชื่อโรงเรียน"],
        school_address: school["ที่อยู่"],
        subdistrict: school["ชื่อตำบล"],
        district: school["ชื่ออำเภอ"],
        province: school["ชื่อจังหวัด"],
        post_code: school["รหัสไปรษณีย์"]?.toString(),
        total_students: parseInt(school["จำนวนนักเรียน"]),
        school_region: school["ภาค"],
        school_affiliation: school["สังกัด"],
        school_district: school["เขต"],
        electricity_provider: school["กฟภ"],
        power_rate: parseFloat(school["อัตรา"]),
        ca: school["CA"],
        operation_status: school["การดำเนินงาน"],

        contact_email: school["E-mail"],
        school_contact_name: school["ชื่อผู้ประสานงานโรงเรียน"],
        school_contact_position: school["ตำแหน่ง"],
        school_contact_phone: school["เบอร์ติดต่อผู้ประสานงาน"],
        school_director: school["ชื่อผู้อำนวยการโรงเรียน"],
        school_director_phone: school["เบอร์ติดต่อ ผอ."],
        electricity_avg_month: parseFloat(school["ค่าฟ้าเฉลี่ย/เดือน"]),
        investor_name: school["ผู้ลงทุน"],
        pea_no: school["เลขที่"],
        pea_date: school["วันที่"],
        moe_doc_no: school["เลขที่ ศธ"],
        moe_doc_date: school["วันที่ตอบกลับ"],
        cover_sheet_no: school["เลขที่ใบปะหน้า"],
        cover_sheet_date: school["วันที่ใบปะหน้า"],
        book_no: school["เลขที่หนังสือ"],
        book_date: school["วันที่หนังสือ"],
        moe_proposal_no: school["เลขที่ ศธ ข้อเสนอ"],
        proposal_date: school["วันที่ข้อเสนอ"],
        simulation: school["Simulation"],
        latitude: parseFloat(school["Latitude"]),
        longitude: parseFloat(school["Longitude"]),
        status: school.statusArr
          ? JSON.parse(
              school.statusArr
                .replaceAll(
                  "ยกเลิก ทำกับเจ้าอื่น",
                  "ยกเลิก เข้าร่วมกับที่อื่นแล้ว"
                )
                .replaceAll("ไม่สนใจ ติดตั้งแล้ว", "ยกเลิก ติดตั้งแล้ว")
                .replaceAll(
                  "ไม่สนใจ เข้าร่วมกับที่อื่นแล้ว",
                  "ยกเลิก เข้าร่วมกับที่อื่นแล้ว"
                )
            ).map((d: any) => JSON.stringify(d))
          : [],
        activity: school.activityArr
          ? JSON.parse(school.activityArr).map((d: any) => JSON.stringify(d))
          : [],
        meter: school.meterArr
          ? JSON.parse(school.meterArr).map((d: any) => JSON.stringify(d))
          : [],
        total_kw_pk: parseFloat(school["รวมKW_PK"]),
        esco_understanding_score: parseInt(
          school["ความเข้าใจในโมเดล ESCO (10%)"]
        ),
        score_cooperation: parseInt(
          school["ระดับความร่วมมือของโรงเรียน (10%)"]
        ),
        score_decision_power: parseInt(
          school["การตัดสินใจและอำนาจภายใน (10%)"]
        ),
        score_data_readiness: parseInt(school["ความพร้อมในการให้ข้อมูล (10%)"]),
        score_electricity_arrears: parseInt(school["การค้างค่าไฟฟ้า (10%)"]),
        note_school: school["หมายเหตุของโรงเรียน"],
        score_install_area: parseInt(school["พื้นที่ติดตั้งที่มีอยู่ (10%)"]),
        score_roof_material: parseInt(school["สภาพวัสดุมุงหลังคา (10%)"]),
        score_structure: parseInt(school["สภาพโครงสร้าง (10%)"]),
        score_connection_wiring: parseInt(
          school["จุดเชื่อมต่อและการเดินสายไฟ (10%)"]
        ),
        score_site_access: parseInt(school["การเข้าถึงหน้างาน (10%)"]),
        note_site: school["หมายเหตุของพื้นที่"],
        score_total: parseFloat(school["รวมคะแนน"]),
        link_invitation: school["link ข้อเสนอโครงการ"],
        link_acceptance: school["link หนังสือเชิญ"],
        link_proposal: school["link หนังสือตอบรับข้อเสนอ"],
      };

      // const res = await createSchool(formattedSchool);
    },
    { concurrency: 3 }
  );

  // ตรวจสอบว่ามีข้อมูลหรือไม่

  return NextResponse.json("success");
}
