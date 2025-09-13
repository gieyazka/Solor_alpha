import { SchoolProps } from "@/@type";
import { useMemo } from "react";

type Row = SchoolProps;

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
  masterDataKey: Record<string, SchoolProps[]>;
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
        selectedRegion.length === 0 ||
        selectedRegion.includes(row["school_region"]!);
      const departmentMatch =
        selectedDepartment.length === 0 ||
        selectedDepartment.includes(row["school_affiliation"]!);
      const provinceMatch =
        selectedProvince.length === 0 ||
        selectedProvince.includes(row["province"]!);
      const areaMatch =
        selectedArea.length === 0 ||
        selectedArea.includes(row["electricity_provider"]!);
      const schoolMatch =
        selectedSchool.length === 0 ||
        selectedSchool.includes(row["school_name"]);

      const statusMatch = (() => {
        if (!selectedStatus) return true;
        try {
          const arr: { status: string; date: string }[] =
            row.status?.map((d) => JSON.parse(d)) || [];
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
      let passingRows: Row[] = [];
      let sumKw = 0;

      // 1) รวม kw จาก meter ของแถวแรก (ถ้ามี)
      if (rows[0]?.meter) {
        try {
          const meterArr: { ca: string; kw_pk: string; rate: string }[] =
            rows[0].meter.map((d) => JSON.parse(d));
          for (const m of meterArr) sumKw += parseFloat(m.kw_pk) || 0;
        } catch {}
      }

      // 2) คัดกรองและ "clone" ทุกแถวที่ผ่านเข้า passingRows
      for (const row of rows) {
        if (!filterRow(row)) continue;
        // สำคัญ: clone ป้องกัน read-only mutation
        passingRows.push({ ...row });
        if (!row.meter) sumKw += parseFloat(String(row.kw_pk)) || 0;
      }

      if (passingRows.length === 0) return acc;

      // 3) เงื่อนไขผ่านตามไฟฟ้า
      const { condition, value } = eletricFilter;
      const threshold = parseFloat(value);
      const op = ops[condition as keyof typeof ops];
      const passKW = condition && value && op ? op(sumKw, threshold) : true;

      if (passKW) {
        // 4) สร้างสำเนาของแถวแรกแล้วใส่ total_kw_pk
        const first = { ...passingRows[0], total_kw_pk: sumKw };
        const newPassing = [first, ...passingRows.slice(1)];

        // 5) เก็บเข้า acc ด้วย key ที่ต้องการ
        const key = first.school_name; // ปรับให้ตรง type ของคุณ
        acc[key] = newPassing;

        totalKW += sumKw;
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
