"use client";

import React from "react";

interface SchoolData {
  ลำดับ: number;
  ประเภท: string;
  เขต: string;
  ชื่อผู้ติดต่อหน่วยงาน: string;
  เบอร์โทรองค์กร: string;
  "กฟภ.": string;
  ภาค: string;
  ชื่อโรงเรียน: string;
  ที่อยู่: string;
  ชื่อตำบล: string;
  อำเภอ: string;
  ชื่อจังหวัด: string;
  รหัสไปรษณีย์: string;
  // อัตรา: string;
  "ติดตั้ง Solar (kW)": string;
  "ประมาณการติดตั้ง Solar cell": string;
  "สถานะดำเนินการของ กฟภ.": string;

  กลุ่ม: string;
  ผู้ลงทุน: string;
  หมายเลขผู้ใช้ไฟฟ้า: string;
  "ชื่อผู้ประสานงาน(1)": string;
  ตำแหน่ง: string;
  เบอร์ติดต่อ: string;
  ชื่อผู้อำนวยการ: string;
  เบอร์ติดต่อผู้อำนวยการ: string;
  การดำเนินงาน: string;
  Status: string;
  นัดพบ: string;
}

export const showKey: Array<keyof SchoolData> = [
  "ลำดับ",
  "หมายเลขผู้ใช้ไฟฟ้า",
  "ประเภท",
  "เขต",
  "ชื่อผู้ติดต่อหน่วยงาน",
  "เบอร์โทรองค์กร",
  "กฟภ.",
  "ภาค",
  "ชื่อโรงเรียน",
  "ที่อยู่",
  "ชื่อตำบล",
  "อำเภอ",
  "ชื่อจังหวัด",
  "รหัสไปรษณีย์",
  "ติดตั้ง Solar (kW)",
  "ประมาณการติดตั้ง Solar cell",
  "สถานะดำเนินการของ กฟภ.",

  "ผู้ลงทุน",
  "กลุ่ม",
  "ชื่อผู้ประสานงาน(1)",
  "ตำแหน่ง",
  "เบอร์ติดต่อ",
  "ชื่อผู้อำนวยการ",
  "เบอร์ติดต่อผู้อำนวยการ",
  "การดำเนินงาน",
  "Status",
  "นัดพบ",
];

const SchoolTable = (props: { schoolData: SchoolData[] }) => {
  const { schoolData } = props;
  return (
    <div className="">
      <h2 className="text-lg font-bold mb-4">ข้อมูลโรงเรียน</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              {showKey.map((key) => (
                <th
                  key={key}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schoolData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {showKey.map((key, idx) => {
                  const value = row[key as keyof SchoolData];
                  if (key === "ชื่อตำบล") {
                    key = key ?? "ตำบล";
                  }
                  if (key === "ชื่อจังหวัด") {
                    key = key ?? "จังหวัด";
                  }
                  return (
                    <td key={idx} className="border border-gray-300 px-4 py-2">
                      {value}
                    </td>
                  );
                })}
                {/* <td className="border border-gray-300 px-4 py-2">
                  {row["ลำดับ"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["หมายเลขผู้ใช้ไฟฟ้า"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["ประเภท"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["เขต"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["ชื่อผู้ติดต่อหน่วยงาน"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["เบอร์โทรองค์กร"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["กฟภ."]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["ภาค"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["ชื่อโรงเรียน"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["ที่อยู่"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["ชื่อตำบล"] ?? row["ตำบล"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["อำเภอ"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["ชื่อจังหวัด"] ?? row["จังหวัด"]}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {row["ติดตั้ง Solar (kW)"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["Status"]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["ผู้ลงทุน"]}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolTable;
