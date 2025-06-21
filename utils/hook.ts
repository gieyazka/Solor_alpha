import { SchoolData } from "@/@type";
import { useMemo } from "react";

type Row = SchoolData;

type EletricFilter = { condition: string; value: string };

// รองรับ operator ต่างๆ แทนการใช้ eval
const ops: Record<
  ">" | "<" | ">=" | "<=" | "==" | "!=",
  (a: number, b: number) => boolean
> = {
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,
  ">=": (a, b) => a >= b,
  "<=": (a, b) => a <= b,
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
};

interface UseFilteredParams {
  masterDataKey: Record<string, Row[]>;
  selectedRegion?: string[];
  selectedDepartment?: string[];
  selectedProvince?: string[];
  selectedArea?: string[];
  selectedSchool?: string[];
  selectedStatus?: string;
  statusOption?: string[]; // e.g. ['ยกเลิก','ไม่สนใจ']
  eletricFilter?: EletricFilter;
}

export function useFilteredSchoolData({
  masterDataKey,
  selectedRegion = [],
  selectedDepartment = [],
  selectedProvince = [],
  selectedArea = [],
  selectedSchool = [],
  selectedStatus = "",
  statusOption = [],
  eletricFilter = { condition: "", value: "" },
}: UseFilteredParams): {
  schoolData: Record<string, Row[]>;
  totalKW: number;
} {
  return useMemo(() => {
    let totalKW = 0;

    function filterRow(row: Row): boolean {
      const regionMatch =
        selectedRegion.length === 0 || selectedRegion.includes(row["ภาค"]);
      const departmentMatch =
        selectedDepartment.length === 0 ||
        selectedDepartment.includes(row["สังกัด"]);
      const provinceMatch =
        selectedProvince.length === 0 ||
        selectedProvince.includes(row["ชื่อจังหวัด"]);
      const areaMatch =
        selectedArea.length === 0 || selectedArea.includes(row["กฟภ"]);
      const schoolMatch =
        selectedSchool.length === 0 ||
        selectedSchool.includes(row["ชื่อโรงเรียน"]);

      const statusMatch = (() => {
        if (!selectedStatus) return true;
        try {
          const arr: { status: string; date: string }[] = JSON.parse(
            row.statusArr ?? "[]"
          );
          // ถ้า selectedStatus เป็นกลุ่ม prefix
          if (statusOption.includes(selectedStatus)) {
            return arr.some((d) => d.status.startsWith(selectedStatus));
          }
          return arr.some((d) => d.status === selectedStatus);
        } catch {
          return false;
        }
      })();

      return (
        regionMatch &&
        departmentMatch &&
        provinceMatch &&
        areaMatch &&
        schoolMatch &&
        statusMatch
      );
    }

    const groupedData = Object.entries(masterDataKey).reduce<
      Record<string, Row[]>
    >((acc, [, rows]) => {
      const passingRows: Row[] = [];
      let sumKw = 0;

      // ถ้า meterArr ในแถวแรกไม่ว่าง ให้ parse ก่อน
      if (rows[0]?.meterArr) {
        try {
          const meterArr: { ca: string; kw_pk: string; rate: string }[] =
            JSON.parse(rows[0].meterArr);
          meterArr.forEach((m) => {
            sumKw += parseFloat(m.kw_pk) || 0;
          });
        } catch {}
      }

      for (const row of rows) {
        if (!filterRow(row)) continue;
        passingRows.push(row);
        if (!row.meterArr) {
          sumKw += parseFloat(String(row["KW_PK"])) || 0;
        }
      }

      if (passingRows.length === 0) return acc;

      const { condition, value } = eletricFilter;
      const threshold = parseFloat(value);
      const op = ops[condition as keyof typeof ops];
      const passKW = condition && value && op ? op(sumKw, threshold) : true;

      if (passKW) {
        passingRows[0]["รวมKW_PK"] = String(sumKw);
        totalKW += sumKw;
        acc[passingRows[0]["ชื่อโรงเรียน"]] = passingRows;
      }

      return acc;
    }, {});

    return { schoolData: groupedData, totalKW };
  }, [
    masterDataKey,
    // ใส่ตรงๆ เพราะเราใช้ default แล้วไม่ต้องแยก property
    selectedRegion,
    selectedDepartment,
    selectedProvince,
    selectedArea,
    selectedSchool,
    selectedStatus,
    statusOption,
    eletricFilter,
  ]);
}
