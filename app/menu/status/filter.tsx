import { SchoolProps } from "@/@type";
import { useMemo } from "react";

export type Selected = {
  selectedRegion: string[];
  selectedDepartment: string[];
  selectedProvince: string[];
  selectedArea: string[];
  selectedSchool: string[];
};

type Grouped = Record<string, SchoolProps[]>;

export type Cascades = {
  regionOptions: Grouped;
  departmentOptions: Grouped;
  provinceOptions: Grouped;
  areaOptions: Grouped;
  schoolOptions: Grouped;
};

const inSel = (sel: string[], v?: string | null) =>
  sel.length === 0 || sel.includes(v ?? "");

export function computeSchoolCascades(
  rows: SchoolProps[],
  sel: Selected,
  { skipEmpty = true }: { skipEmpty?: boolean } = {}
): Cascades {
  const region = new Map<string, SchoolProps[]>();
  const dept = new Map<string, SchoolProps[]>();
  const prov = new Map<string, SchoolProps[]>();
  const area = new Map<string, SchoolProps[]>();
  const school = new Map<string, SchoolProps[]>();

  const push = (
    m: Map<string, SchoolProps[]>,
    k?: string | null,
    r?: SchoolProps
  ) => {
    const key = (k ?? "").trim();
    if (skipEmpty && !key) return;
    const arr = m.get(key) ?? [];
    if (r) arr.push(r);
    m.set(key, arr);
  };

  for (const r of rows) {
    const rg = r.school_region ?? "";
    const dp = r.school_affiliation ?? "";
    const pv = r.province ?? "";
    const ar = r.electricity_provider ?? "";
    const sc = r.school_name ?? "";

    const mRegion = inSel(sel.selectedRegion, rg);
    const mDept = inSel(sel.selectedDepartment, dp);
    const mProv = inSel(sel.selectedProvince, pv);
    const mArea = inSel(sel.selectedArea, ar);
    const mSchool = inSel(sel.selectedSchool, sc);

    // เหมือนโค้ดเดิม: ตอน group แต่ละมิติ ให้ "ไม่ใช้" ตัวกรองของมิตินั้นเอง
    if (mDept && mProv && mArea && mSchool) push(region, rg, r);
    if (mRegion && mProv && mArea && mSchool) push(dept, dp, r);
    if (mRegion && mDept && mArea && mSchool) push(prov, pv, r);
    if (mRegion && mProv && mDept && mSchool) push(area, ar, r);
    if (mRegion && mDept && mProv && mArea) push(school, sc, r);
  }

  const obj = (m: Map<string, SchoolProps[]>) =>
    Object.fromEntries(
      [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    );

  return {
    regionOptions: obj(region),
    departmentOptions: obj(dept),
    provinceOptions: obj(prov),
    areaOptions: obj(area),
    schoolOptions: obj(school),
  };
}

export function useSchoolCascades(rows: SchoolProps[], sel: Selected) {
  // ถ้า selected* เป็น array ใหม่ทุกครั้ง ให้ผูก dep ด้วย JSON.stringify
  const depKey = JSON.stringify([
    sel.selectedRegion,
    sel.selectedDepartment,
    sel.selectedProvince,
    sel.selectedArea,
    sel.selectedSchool,
  ]);
  return useMemo(() => computeSchoolCascades(rows, sel), [rows, depKey]);
}
