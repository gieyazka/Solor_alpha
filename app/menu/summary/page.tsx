"use client";
import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  Zap,
  GraduationCap,
  MapPin,
  Building,
  Battery,
} from "lucide-react";
import { useFilteredSchoolData } from "@/utils/hook";
import { useSchoolStore } from "@/stores";
import { activityOption } from "@/utils/options";
import FilterPopover from "../dashboard/filterPopover";
import {
  CustomAutoComplete,
  CustomSingleAutoComplete,
} from "../dashboard/autocomplete";
import _ from "lodash";
import { StatusCard } from "./status";
import FancySchoolDialog from "./dialog";
import { SchoolData } from "@/@type";
const REGIONS = [
  "เหนือ",
  "กลาง",
  "ตะวันออก",
  "ตะวันออกเฉียงเหนือ",
  "ตะวันตก",
] as const;
const statusOption = [
  "สนใจนำเสนอโครงการ",
  "ตอบรับเข้าร่วมโครงการ",
  "ชี้แจงโครงการ+สำรวจ",
  "กฟภ. ส่งข้อเสนอโครงการ+ร่างสัญญา",
  "นำเสนอข้อเสนอโครงการ",
  "ตอบรับร่างสัญญาโครงการ",
  "กฟภ. ทำสัญญาให้บริการ",
  "ไม่สนใจ",
  "ยกเลิก",
];
interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor?: string;
}

interface CircularProgressProps {
  current: number;
  total: number;
  label: string;
  size?: "sm" | "md";
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  bgColor,
  textColor = "text-white",
}) => (
  <div className={`${bgColor} ${textColor} p-4 rounded-xl shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm opacity-90">{label}</div>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  </div>
);

const CircularProgress: React.FC<CircularProgressProps> = ({
  current,
  total,
  label,
  size = "md",
}) => {
  const masterData = useSchoolStore();

  const percentage = (current / total) * 100;
  const radius = size === "sm" ? 30 : 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg">
      <div className="relative">
        <svg
          width={size === "sm" ? 160 : 200}
          height={size === "sm" ? 160 : 200}
          className="transform -rotate-90"
        >
          <circle
            cx={size === "sm" ? 80 : 100}
            cy={size === "sm" ? 80 : 100}
            r={radius}
            stroke="#f3f4f6"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size === "sm" ? 80 : 50}
            cy={size === "sm" ? 80 : 50}
            r={radius}
            stroke="#10b981"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-green-600">{current}</span>
          <span className="text-xs text-gray-500">
            {percentage.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="text-xs text-center text-gray-600 mt-2 max-w-20">
        {label}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const masterData = useSchoolStore();
  const [dailogState, setDialogState] = useState<{
    open: boolean;
    data?: string[];
  }>({
    data: undefined,
    open: false,
  });
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [eletricFilter, setElectricFilter] = useState<{
    condition: string;
    value: string;
  }>({
    condition: "",
    value: "",
  });

  const { schoolData, totalKW } = useFilteredSchoolData({
    masterDataKey: masterData.masterDataKey,
    selectedRegion,
    selectedDepartment,
    selectedProvince,
    selectedArea,
    selectedSchool,
    selectedStatus: selectedStatus,
    statusOption: statusOption,
    eletricFilter,
  });

  const onOpen = (data: string[]) => {
    setDialogState({ data, open: true });
  };

  const summaryData = useMemo(() => {
    const provincesSet = new Set<string>();

    const statusCounts: Record<string, number> = {};
    const statusItems: Record<string, { schoolName: string; id: number }[]> =
      {};
    const activityCounts: Record<string, number> = {};
    const activityItems: Record<string, { schoolName: string; id: number }[]> =
      {};
    const regionCounts: Record<string, number> = {};
    const regionItems: Record<string, { schoolName: string; id: number }[]> =
      {};

    // initialize keys
    const statusKeys = ["ยังไม่ได้ดำเนินการ", ...statusOption];
    statusKeys.forEach((k) => {
      statusCounts[k] = 0;
      statusItems[k] = [];
    });

    const activityKeys = activityOption;
    activityKeys.forEach((k) => {
      activityCounts[k] = 0;
      activityItems[k] = [];
    });
    // กรณีมี default “ยังไม่ได้ดำเนินการ” ใน activity
    if (!activityCounts["ยังไม่ได้ดำเนินการ"]) {
      activityCounts["ยังไม่ได้ดำเนินการ"] = 0;
      activityItems["ยังไม่ได้ดำเนินการ"] = [];
    }

    const regionKeys = REGIONS;
    regionKeys.forEach((r) => {
      regionCounts[r] = 0;
      regionItems[r] = [];
    });

    // วนข้อมูลแต่ละโรงเรียน
    Object.entries(schoolData).forEach(([schoolKey, rows]) => {
      // เก็บจังหวัด
      const first = rows[0];
      const province = first?.["ชื่อจังหวัด"];
      if (province) provincesSet.add(province);

      // ── Region ──
      const region = first?.["ภาค"];
      if (region && regionItems[region]) {
        regionCounts[region]++;
        regionItems[region].push({ schoolName: schoolKey, id: rows[0].id });
      }

      // ── Status ──
      let statusArr: { status: string; date: string }[] = [];
      try {
        statusArr = JSON.parse(first?.statusArr || "[]");
      } catch {}
      let lastStatus = statusArr.length
        ? statusArr.sort((a, b) => +new Date(a.date) - +new Date(b.date)).pop()!
            .status
        : "";
      if (lastStatus.startsWith("ยกเลิก")) lastStatus = "ยกเลิก";
      else if (lastStatus.startsWith("ไม่สนใจ")) lastStatus = "ไม่สนใจ";
      else if (!lastStatus) lastStatus = "ยังไม่ได้ดำเนินการ";

      if (!statusItems[lastStatus]) {
        statusItems[lastStatus] = [];
        statusCounts[lastStatus] = 0;
      }
      statusCounts[lastStatus]++;
      statusItems[lastStatus].push({ schoolName: schoolKey, id: rows[0].id });

      // ── Activity ──
      let actArr: { activity: string; date: string }[] = [];
      try {
        actArr = JSON.parse(first.activityArr || "[]");
      } catch {}

      // หา activity สุดท้าย
      let rawAct = "";
      if (actArr.length) {
        rawAct = actArr
          .sort((a, b) => +new Date(a.date) - +new Date(b.date))
          .pop()!.activity;
      }

      // รวมทุก prefix เป็นคีย์เดียว
      let lastAct = "";
      if (rawAct.startsWith("ส่งหนังสือเชิญ")) {
        lastAct = "ส่งหนังสือเชิญ";
      } else if (!rawAct) {
        lastAct = "ยังไม่ได้ดำเนินการ";
      } else {
        lastAct = rawAct;
      }

      // init bucket ถ้ายังไม่มี
      if (!activityItems[lastAct]) {
        activityItems[lastAct] = [];
        activityCounts[lastAct] = 0;
      }

      // เก็บนับและเก็บ key ของโรงเรียน
      activityCounts[lastAct]++;
      activityItems[lastAct].push({ schoolName: schoolKey, id: rows[0].id });
    });

    // สร้างลิสต์คีย์จาก object จริง
    const statusKeysList = Object.keys(statusItems);
    const activityKeysList = Object.keys(activityItems);
    const regionKeysList = Object.keys(regionItems);

    return {
      provincesCount: provincesSet.size,
      provincesList: Array.from(provincesSet),

      statusCounts,
      statusItems,
      statusKeysList,

      activityCounts,
      activityItems,
      activityKeysList,

      regionCounts,
      regionItems,
      regionKeysList,
    };
  }, [schoolData, statusOption, activityOption, REGIONS]);
  const handleRegionChange = (region: string[] | null | undefined) => {
    if (region) {
      setSelectedRegion(region);
    } else {
      setSelectedRegion([]);
    }
  };
  const regionOptions = _.groupBy(
    masterData.masterData.filter((s) => {
      const departmentMatch =
        selectedDepartment.length === 0 ||
        selectedDepartment.includes(s["สังกัด"]);
      const provinceMatch =
        selectedProvince.length === 0 ||
        selectedProvince.includes(s["ชื่อจังหวัด"]);
      const areaMatch =
        selectedArea.length === 0 || selectedArea.includes(s["กฟภ"]);
      const schoolMatch =
        selectedSchool.length === 0 ||
        selectedSchool.includes(s["ชื่อโรงเรียน"]);
      return departmentMatch && provinceMatch && areaMatch && schoolMatch;
    }),
    "ภาค"
  );

  const departmentOptions = _.groupBy(
    masterData.masterData.filter((s) => {
      const regionMatch =
        selectedRegion.length === 0 || selectedRegion.includes(s["ภาค"]);
      const provinceMatch =
        selectedProvince.length === 0 ||
        selectedProvince.includes(s["ชื่อจังหวัด"]);
      const areaMatch =
        selectedArea.length === 0 || selectedArea.includes(s["กฟภ"]);
      const schoolMatch =
        selectedSchool.length === 0 ||
        selectedSchool.includes(s["ชื่อโรงเรียน"]);
      return regionMatch && provinceMatch && schoolMatch && areaMatch;
    }),
    "สังกัด"
  );

  const provinceOptions = _.groupBy(
    masterData.masterData.filter((s) => {
      const regionMatch =
        selectedRegion.length === 0 || selectedRegion.includes(s["ภาค"]);
      const departmentMatch =
        selectedDepartment.length === 0 ||
        selectedDepartment.includes(s["สังกัด"]);
      const areaMatch =
        selectedArea.length === 0 || selectedArea.includes(s["กฟภ"]);
      const schoolMatch =
        selectedSchool.length === 0 ||
        selectedSchool.includes(s["ชื่อโรงเรียน"]);
      return regionMatch && departmentMatch && schoolMatch && areaMatch;
    }),
    "ชื่อจังหวัด"
  );

  const areaOptions = _.groupBy(
    masterData.masterData.filter((s) => {
      const regionMatch =
        selectedRegion.length === 0 || selectedRegion.includes(s["ภาค"]);
      const provinceMatch =
        selectedProvince.length === 0 ||
        selectedProvince.includes(s["ชื่อจังหวัด"]);
      const departmentMatch =
        selectedDepartment.length === 0 ||
        selectedDepartment.includes(s["สังกัด"]);
      const schoolMatch =
        selectedSchool.length === 0 ||
        selectedSchool.includes(s["ชื่อโรงเรียน"]);
      return regionMatch && provinceMatch && schoolMatch && departmentMatch;
    }),
    "กฟภ."
  );
  const schoolOptions = _.groupBy(
    masterData.masterData.filter((s) => {
      const regionMatch =
        selectedRegion.length === 0 || selectedRegion.includes(s["ภาค"]);
      const departmentMatch =
        selectedDepartment.length === 0 ||
        selectedDepartment.includes(s["สังกัด"]);
      const provinceMatch =
        selectedProvince.length === 0 ||
        selectedProvince.includes(s["ชื่อจังหวัด"]);
      const areaMatch =
        selectedArea.length === 0 || selectedArea.includes(s["กฟภ"]);

      return regionMatch && departmentMatch && provinceMatch && areaMatch;
    }),
    "ชื่อโรงเรียน"
  );
  const totalSchool = Object.keys(schoolData).length;
  return (
    <div className=" bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <FancySchoolDialog
          open={dailogState.open}
          schools={dailogState.data || []}
          selectedSchool={selected}
          onSelect={(s) => setSelected(s)}
          onClose={() => setDialogState({ open: false })}
        />
        <div className="flex flex-wrap gap-2 mb-4">
          <CustomAutoComplete
            label="เลือกภูมิภาค"
            handleChange={handleRegionChange}
            dataKey={regionOptions}
          />
          <CustomAutoComplete
            label="เลือกสังกัด"
            handleChange={(props) => {
              if (props) {
                setSelectedDepartment(props);
              } else {
                setSelectedDepartment([]);
              }
            }}
            dataKey={departmentOptions}
          />
          <CustomAutoComplete
            label="เลือกจังหวัด"
            handleChange={(props) => {
              if (props) {
                setSelectedProvince(props);
              } else {
                setSelectedProvince([]);
              }
            }}
            dataKey={provinceOptions}
          />

          <CustomAutoComplete
            label="เลือกเขตไฟฟ้า"
            handleChange={(props) => {
              if (props) {
                setSelectedArea(props);
              } else {
                setSelectedArea([]);
              }
            }}
            dataKey={areaOptions}
          />
          <CustomAutoComplete
            label="ค้นหาชื่อโรงเรียน"
            handleChange={(props) => {
              if (props) {
                setSelectedSchool(props);
              } else {
                setSelectedSchool([]);
              }
            }}
            dataKey={schoolOptions}
          />
          {/* <CustomSingleAutoComplete
            label="เลือกสถานะ"
            handleChange={(props) => {
              setSelectedStatus(props);
            }}
            dataKey={_.groupBy(
              statusOption,
              (item) => item.split("12312321213")[0]
            )}
          /> */}
          <FilterPopover
            onSubmit={(condition: string, value: string) => {
              setElectricFilter({
                condition,
                value,
              });
            }}
          />
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          value={totalKW.toLocaleString()}
          label="ปริมาณการจัดส่ง (KW)"
          icon={<Zap />}
          bgColor="bg-purple-600"
        />
        <StatCard
          value={totalSchool.toLocaleString()}
          label="จำนวนโรงเรียน"
          icon={<GraduationCap />}
          bgColor="bg-green-500"
        />
        <StatCard
          value={summaryData.provincesCount.toLocaleString()}
          label="จำนวนจังหวัด"
          icon={<MapPin />}
          bgColor="bg-orange-500"
        />
        {/* <StatCard
          value="12"
          label="จำนวนสังกัด"
          icon={<Building />}
          bgColor="bg-green-600"
        />
        <StatCard
          value="8"
          label="จำนวนเขตไฟฟ้า"
          icon={<Battery />}
          bgColor="bg-cyan-500"
        /> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1">
          {/* Secondary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              "ส่งหนังสือเชิญ",
              "นัดหมาย+ส่งหนังสือขอชี้แจง+สำรวจ",
              "ประเมินโครงการ+เตรียมทำข้อเสนอ",
              "นัดวันนำเสนอข้อเสนอโครงการ",
              "ติดตามสถานะโรงเรียนพิจารณาข้อเสนอ",
              "ติดตามตามเอกสารรอเซ็นต์สัญญา",
              "ยกเลิกไม่ทำโครงการ",
            ].map((activity) => {
              return (
                <div
                  onClick={() => {
                    const schoolNameList = summaryData.activityItems[
                      activity
                    ].map((d) => d.schoolName);
                    onOpen(schoolNameList);
                  }}
                  key={activity}
                  className="bg-white p-6 rounded-xl shadow-lg text-center cursor-pointer hover:bg-gray-100 transition-all duration-300"
                >
                  {/* <div className="text-green-500 text-2xl mb-1">✓</div> */}
                  <div className="text-sm text-gray-600">{activity}</div>
                  <div className="text-2xl font-bold">
                    {summaryData.activityCounts[activity] || 0}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Circular Progress Charts */}
          <div className="grid grid-cols-3 md:grid-cols- lg:grid-cols-5 gap-3">
            {["ยังไม่ได้ดำเนินการ", ...statusOption].map((status) => {
              return (
                <div
                key={status}
                onClick={() => {
                    const schoolNameList = summaryData.statusItems[
                      status
                    ].map((d) => d.schoolName);
                    onOpen(schoolNameList);
                  }}
                >
                  <StatusCard
                    count={summaryData.statusCounts[status]}
                    label={status}
                    percentage={
                      (100 * summaryData.statusCounts[status]) / totalSchool
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="font-bold text-gray-800 mb-4">
              สำนักงานส่วนกลางรายงาน
            </h3>
            <div className="space-y-3">
              {REGIONS.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item}</span>
                  <span
                    className={`bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {summaryData.regionCounts[item]}
                  </span>
                </div>
              ))}
            </div>
            {/* <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600 text-center">
                จำนวนโรงเรียนยังไม่ได้ลงทะเบียน
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
