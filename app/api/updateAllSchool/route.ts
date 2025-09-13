import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { readFile } from "fs/promises";
import path from "path";
import { SchoolData, SchoolProps } from "@/@type";
import { createSchool, getAllSchool, updateSchool } from "@/actions/school";
import pMap from "p-map";
import _ from "lodash";
import ObjectsToCsv from "objects-to-csv";
import dayjs from "dayjs";
export const reFormatCurrency = (value: string | number) => {
  return value?.toString().replaceAll(/,/g, "");
};
export async function GET() {
  const allSchool = await getAllSchool();
  const filePath = path.join(process.cwd(), "public", "Masterdata.csv"); // หรือ data/schools.csv
  const csv = await readFile(filePath, "utf8");

  const records = parse(csv, {
    columns: (header) => header.map((h) => h.replace(/['"]/g, "").trim()), // แปลง header เป็น key
    skip_empty_lines: true,
    trim: true,
  }) as SchoolData[];
  console.log("records.length", records.length);
  // const groupByMasterId = _.groupBy(records, "id");
  const groupBySchoolId = _.groupBy(allSchool, "id");
  const groupBySchoolName = _.groupBy(allSchool, "school_name");
  const groupMasterBySchoolName = _.groupBy(records, "ชื่อโรงเรียน");

  console.log("school", allSchool.length);
  // (async () => {
  // const csv = new ObjectsToCsv(allSchool);

  // Save to file:
  // await csv.toDisk(`./backupSchool_${dayjs().format("YYYYMMDD")}.csv`);

  // Return the CSV file as string:
  // console.log(await csv.toString());
  // })();
  await pMap(
    Object.keys(groupBySchoolName),
    async (school_name) => {
      // const elec = masterScool["ค่าฟ้าเฉลี่ย/เดือน"];

      const findSchool = groupBySchoolName[school_name];
      const findMasterSchool = groupMasterBySchoolName[school_name];
      // console.log("findSchool", findSchool, masterScool.id);
      // console.log("35", findSchool?.[0].id, findSchool?.[0].meter);

      if (
        findSchool?.[0].meter &&
        _.isEqual(
          JSON.parse(
            groupBySchoolId[findSchool[0].id]?.[0]?.meter?.[0] ?? "{}"
          ),
          {
            ca: "",
            kw_pk: "",
            rate: "",
          }
        )
      ) {
        // console.log("upper if", findSchool);
        // console.log(
        //   "upper if",
        //   findSchool[0].$id,
        //   findSchool[0].id,
        //   findSchool[0].school_name,
        //   findSchool.length
        // );
        const findBySchoolName =
          groupMasterBySchoolName[findSchool[0].school_name];
        // console.log("findBySchoolName", findBySchoolName.length);
        let total_kw_pk = 0;
        // const mapMeter = findBySchoolName.map((item) => {
        //   total_kw_pk += parseFloat(reFormatCurrency(item["KW_PK"]));
        //   return JSON.stringify({
        //     ca: item.CA,
        //     kw_pk: reFormatCurrency(item["KW_PK"]),
        //     rate: reFormatCurrency(item["อัตรา"]),
        //   });
        // });
        // console.log("mapMeter", total_kw_pk, mapMeter);
        // const resUpdate = updateSchool({
        //   id: findSchool[0].$id,
        //   data: {
        //     meter: mapMeter,
        //     total_kw_pk,
        //   },
        // });
      } else if (
        findSchool?.[0].meter === null ||
        findSchool?.[0].meter?.length === 0
      ) {
        // if (findSchool[0].id === 41) {
        console.log(
          "lower if",
          findSchool[0].$id,
          findSchool[0].id,
          findSchool[0].school_name,
          findSchool.length
        );
        const findBySchoolName =
          groupMasterBySchoolName[findSchool[0].school_name];
        console.log("findBySchoolName", findBySchoolName.length);
        let total_kw_pk = 0;
        const mapMeter = findBySchoolName.map((item) => {
          total_kw_pk += isNaN(parseFloat(reFormatCurrency(item["KW_PK"])))
            ? 0
            : parseFloat(reFormatCurrency(item["KW_PK"]));
          return JSON.stringify({
            ca: item.CA,
            kw_pk: reFormatCurrency(item["KW_PK"]),
            rate: reFormatCurrency(item["อัตรา"]),
          });
        });
        console.log("mapMeter", total_kw_pk, mapMeter);
        // const resUpdate = updateSchool({
        //   id: findSchool[0].$id,
        //   data: {
        //     meter: mapMeter,
        //     total_kw_pk,
        //   },
        // });
      }
      // }
    },
    { concurrency: 3 }
  );

  // ตรวจสอบว่ามีข้อมูลหรือไม่

  return NextResponse.json("success");
}
