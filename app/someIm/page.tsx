"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SchoolTable, { showKey } from "../../components/event/table";
export default function XlsxUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile_2, setSelectedFile_2] = useState(null);
  const [selectedFile_4, setSelectedFile_4] = useState(null);
  const [selectedFile_5, setSelectedFile_5] = useState(null);
  const [data, setData] = useState<any[]>([]);
  const [data_2, setData_2] = useState<any[]>([]);
  const [data_3, setData_3] = useState<any[]>([]);
  const [data_4, setData_4] = useState<any[]>([]);
  const [data_5, setData_5] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<any>();
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleFileChange_2 = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile_2(file);
  };
  const handleFileChange_4 = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile_4(file);
  };
  const handleFileChange_5 = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile_5(file);
  };

  const exportToExcel = () => {
    const exportData = compareData.map((item : any) =>
      showKey.reduce((acc, key) => {
        acc[key] = item[key] ?? ""; // ถ้าไม่มีค่า ให้เป็น ""
        return acc;
      }, {} as Record<string, any>)
    );
    const ws = XLSX.utils.json_to_sheet(exportData); // แปลง JSON เป็น Sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "โรงเรียน"); // เพิ่ม Sheet ใน Workbook

    // บันทึกไฟล์
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(dataBlob, "schools.xlsx");
  };

  useEffect(() => {
    // if (data && data_2 && data_3 && data_4) {

    let mergedMap = new Map();
    [data, data_2, data_3, data_4].forEach((dataset) => {
      mergedMap = mergeData(dataset, mergedMap);
    });

    // data.forEach((item) => {
    //   const key = item.ชื่อโรงเรียน.replace("โรงเรียน", "").trim();
    //   mergedMap.set(key, { ...item });
    // });

    // data_3.forEach((item) => {
    //   const key = item.ชื่อโรงเรียน.replace("โรงเรียน", "").trim();
    //   mergedMap.set(key, { ...item });
    // });

    // // ตรวจสอบข้อมูลจากไฟล์ที่สอง (file2Data) และรวมข้อมูลที่ซ้ำกัน
    // data_2.forEach((item) => {
    //   const key = item.ชื่อโรงเรียน.replace("โรงเรียน", "").trim();

    //   if (mergedMap.has(key)) {
    //     // ถ้ามีข้อมูลซ้ำ ให้รวมค่า Field ต่างๆ
    //     const existing = mergedMap.get(key);

    //     Object.keys(item).forEach((field) => {
    //       if (field !== "ชื่อโรงเรียน") {
    //         if (existing[field]) {
    //           // ถ้าค่าที่มีอยู่และค่าจากไฟล์สองไม่เหมือนกัน ให้รวมข้อมูลเป็น Array
    //           if (existing[field] !== item[field]) {
    //             existing[field] = [
    //               ...new Set([existing[field], item[field]].flat()),
    //             ].join(", ");
    //           }
    //         } else {
    //           // ถ้ายังไม่มีค่าของ Field นี้ ให้เพิ่มเข้าไป
    //           existing[field] = item[field];
    //         }
    //       }
    //     });

    //     mergedMap.set(key, existing);
    //   } else {
    //     // ถ้าไม่มีข้อมูลซ้ำ ให้เพิ่มลงไป
    //     mergedMap.set(key, { ...item });
    //   }
    // });

    // แปลง Map กลับเป็น Array
    const finalData = Array.from(mergedMap.values());
    const districtMap = new Map();
    data_5.forEach((item) => {
      const schoolName = item.ชื่อโรงเรียน
        .replace("โรงเรียน", "")
        .replaceAll(" ", "")
        .trim(); // ตัด "โรงเรียน" ออก
      districtMap.set(schoolName, item["ชื่อเขต"]); // เก็บเขตตามชื่อโรงเรียน
    });

    finalData.forEach((value, key) => {
      const schoolName = value.ชื่อโรงเรียน
        .replace("โรงเรียน", "")
        .replaceAll(" ", "")
        .trim();
      if (districtMap.has(schoolName)) {
        console.log("schoolName", schoolName);
        value.ประเภท = districtMap.get(schoolName).split("เขต")[0]; // เพิ่มค่า "เขต"
        value.เขต = districtMap.get(schoolName).split("เขต")[1]; // เพิ่มค่า "เขต"
      } else {
        value.เขต = ""; // ถ้าไม่มีใน data_4 ให้ใส่ค่าเริ่มต้น
      }
    });

    setCompareData(finalData);
    // }
    // else if (data) {
    //   setCompareData(data);
    // } else if (data_2) {
    //   setCompareData(data_2);
    // } else if (data_3) {
    //   setCompareData(data_3);
    // }
  }, [data, data_2, data_3, data_4, data_5]);
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("sheet", "0");
    setLoading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setData(result.data);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };
  // console.log("mergeData", compareData);
  const handleUpload_2 = async () => {
    if (!selectedFile_2) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", selectedFile_2);
    formData.append("sheet", "2");

    setLoading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        // console.log("result.data", result.data);
        setData_2(result.data);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleUpload_3 = async () => {
    if (!selectedFile_2) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", selectedFile_2);
    formData.append("sheet", "4");

    setLoading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setData_3(result.data);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleUpload_4 = async () => {
    if (!selectedFile_4) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", selectedFile_4);
    formData.append("sheet", "0");

    setLoading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setData_4(result.data);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleUpload_5 = async () => {
    if (!selectedFile_5) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", selectedFile_5);
    formData.append("sheet", "0");

    setLoading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setData_5(result.data);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center">
        Master(ปลอม){" "}
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="flex gap-2 items-center">
        รายชื่อผ่านข้อกำหนด
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange_2}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload_2}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="flex gap-2 items-center">
        Focus
        <button
          onClick={handleUpload_3}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="flex gap-2 items-center">
        รร ซ้ำ
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange_4}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload_4}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="flex gap-2 items-center">
        10000 รร
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange_5}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload_5}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div>
        <button onClick={exportToExcel}>Export</button>
      </div>
      {/* {data && (
        <div className="mt-4 w-full max-w-2xl">
          <h2 className="text-lg font-bold mb-2">Parsed Excel Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )} */}
      {/* {data_2 && JSON.stringify(data_2[0], null, 2)} */}
      <div className="grid grid-cols-1 gap-4 px-2">
        <div>{compareData && <SchoolTable schoolData={compareData} />}</div>
      </div>

      {/* {data_2 && (
        <div className="mt-4 w-full max-w-2xl">
          <h2 className="text-lg font-bold mb-2">Parsed Excel Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data_2, null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
}

// ฟังก์ชันรวมข้อมูลที่ซ้ำกัน
const mergeData = (data: any[], mergedMap: Map<string, any>) => {
  data.forEach((item) => {
    const key = item.ชื่อโรงเรียน
      .replace("โรงเรียน", "")
      .replaceAll(" ", "")
      .trim(); // ลบคำว่า "โรงเรียน" ออกเพื่อตรวจสอบความซ้ำ

    if (mergedMap.has(key)) {
      const existing = mergedMap.get(key);

      Object.keys(item).forEach((field) => {
        if (field !== "ชื่อโรงเรียน") {
          if (existing[field]) {
            // ถ้าค่าที่มีอยู่และค่าจากไฟล์ใหม่ไม่เหมือนกัน ให้รวมข้อมูลเป็น Array
            if (existing[field] !== item[field]) {
              existing[field] = [
                ...new Set([existing[field], item[field]].flat()),
              ].join(", ");
            }
          } else {
            // ถ้ายังไม่มีค่าของ Field นี้ ให้เพิ่มเข้าไป
            existing[field] = item[field];
          }
        }
      });

      mergedMap.set(key, existing);
    } else {
      // ถ้ายังไม่มีข้อมูลนี้ ให้เพิ่มเข้าไป

      mergedMap.set(key, { ...item });
    }
  });
  return mergedMap;
};
