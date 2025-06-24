"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Eye, FileText, Trash2, BarChart3 } from "lucide-react";
import { useSchoolStore } from "@/stores";
import {
  Autocomplete,
  Box,
  List,
  ListItem,
  ListItemText,
  Pagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Condition, SchoolData } from "@/@type";
import clsx from "clsx";
import _ from "lodash";
import { CustomAutoComplete, CustomSingleAutoComplete } from "./autocomplete";
import FilterPopover from "./filterPopover";
import { ops } from "@/utils/fn";
import { useFilteredSchoolData } from "@/utils/hook";

type filterType = {
  province?: string[];
  school?: string[];
  sector?: string[];
  section?: string[];
  area?: string[];
};

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

const collator = new Intl.Collator("th", { sensitivity: "base" });
function Dashboard() {
  const [filters, setFilters] = useState({
    school: "",
    district: "",
    province: "",
    document: "",
    status: "",
  });
  const masterData = useSchoolStore();
  const [page, setPage] = useState(1);
  const perPage = 10;
  // const [schoolData, setSchoolData] = useState(masterData.masterDataKey);

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
    statusOption,
    eletricFilter,
  });

  // reset page ทุกครั้งที่ filtered result เปลี่ยน
  useEffect(() => {
    setPage(1);
  }, [schoolData]);

 
  const handleRegionChange = (region: string[] | null | undefined) => {
    if (region) {
      setSelectedRegion(region);
    } else {
      setSelectedRegion([]);
    }
    setPage(1);
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

  // Sample data - replace with your actual data

  const getStatusColor = (check: boolean, i: number) => {
    if (check) {
      if (i == 8 || i == 9) return "bg-red-500";
      return "bg-green-500";
    }

    return "bg-gray-300";
  };
  // const getStatusColor = (step: number, currentStatus: any) => {
  //   if (currentStatus >= step) {
  //     return "bg-green-500";
  //   }
  //   return "bg-gray-300";
  // };
  // useEffect(() => {
  //   setSchoolData(masterData.masterDataKey);
  // }, [masterData]);
  // console.log("regionOptions", regionOptions);
  return (
    <div className="p-4 overflow-auto relative ">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-sm">
        {/* Header with Filters */}
        <div className=" border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
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
              <CustomSingleAutoComplete
                label="เลือกสถานะ"
                handleChange={(props) => {
                  setSelectedStatus(props);
                }}
                dataKey={_.groupBy(
                  statusOption,
                  (item) => item.split("12312321213")[0]
                )}
              />
              <FilterPopover
                onSubmit={(condition: string, value: string) => {
                  setElectricFilter({
                    condition,
                    value,
                  });
                }}
              />
              {/* <CustomAutoComplete
                label="เลือกการดำเนินการ"
                handleChange={(props) => {
                  console.log("props", props);
                }}
                dataKey={masterData.masterDataKey}
              /> */}
              {/* <button className="bg-purple-600 hover:bg-purple-700 text-white px-6  rounded-lg font-medium transition-colors">
                สร้างรายงาน
              </button> */}
            </div>
          </div>
          <p className="text-end p-2 font-bold text-2xl">
            รวม {totalKW.toLocaleString()} KW
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                <th className="text-center py-4 px-6 font-medium">
                  ชื่อโรงเรียน
                </th>
                <th className="text-center py-4 px-6 font-medium">KW_PK</th>
                <th className="text-center py-4 px-6 font-medium">จังหวัด</th>
                <th className="text-center py-4 px-6 font-medium">สังกัด</th>
                <th className="text-center py-4 px-6 font-medium">
                  สถานะปัจจุบัน
                </th>
                <th className="text-center py-4 px-6 font-medium">สถานะ</th>
                <th className="text-center py-4 px-6 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(schoolData)
                .sort(collator.compare)

                .splice((page - 1) * perPage, perPage)
                .map((key, index) => {
                  const item = schoolData[key][0];
                  const status = item?.statusArr
                    ? JSON.parse(item?.statusArr)
                    : [];
                  const groupData = _.groupBy(status, "status");
                  let meterArr =
                    item.meterArr !== ""
                      ? JSON.parse(item.meterArr)
                      : schoolData[key]?.map((d) => {
                          return {
                            ca: d.CA,
                            kw_pk: d.KW_PK,
                            rate: d.อัตรา,
                          };
                        });
                  return (
                    <tr
                      onClick={() => {
                        console.log(schoolData[key]);
                      }}
                      key={item.id}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-purple-50 transition-colors`}
                    >
                      <td className="py-2 px-6 text-gray-800 text-start">
                        {item["ชื่อโรงเรียน"]}
                      </td>
                      <td className="py-2 px-6 text-gray-800 text-center">
                        <Tooltip
                          key={`${item.id}`}
                          enterTouchDelay={100}
                          leaveTouchDelay={3000}
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: "#fff", // พื้นหลังขาว
                                color: "text.primary", // สีตัวอักษรเป็นสีหลัก (ดำ)
                                boxShadow: 1, // เพิ่มเงาเล็กน้อย
                                maxWidth: 240,
                              },
                            },
                            arrow: {
                              sx: {
                                color: "#fff", // ลูกศรเป็นสีขาวเช่นกัน
                              },
                            },
                          }}
                          title={
                            <Box sx={{ p: 1, maxWidth: 200 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                รายละเอียด CA
                              </Typography>
                              <List dense disablePadding>
                                {meterArr?.map(
                                  (
                                    d: {
                                      ca: string;
                                      kw_pk: string;
                                      rate: string;
                                    },
                                    idx: number
                                  ) => (
                                    <ListItemText
                                      primary={
                                        <Typography
                                          variant="body2"
                                          fontWeight={500}
                                          noWrap
                                        >
                                          {d.ca}
                                        </Typography>
                                      }
                                      secondary={
                                        <Typography variant="caption" noWrap>
                                          KW_PK: {d.kw_pk} | อัตรา: {d.rate}
                                        </Typography>
                                      }
                                    />
                                  )
                                )}
                              </List>
                            </Box>
                          }
                        >
                          <div className="flex items-center">
                            <div>
                              {(
                                parseFloat(String(item["รวมKW_PK"] ||0)) || 0
                              )?.toLocaleString()}
                            </div>
                          </div>
                        </Tooltip>
                      </td>
                      <td className="py-2 px-6 text-gray-600 text-center">
                        {item["ชื่อจังหวัด"]}
                      </td>
                      <td className="py-2 px-6 text-gray-600 text-center">
                        {item["สังกัด"]}
                      </td>
                      <td className="py-2 px-6 text-gray-600 text-center">
                        {
                          (_.last(status) as { status: string; date: string })
                            ?.status
                        }
                      </td>
                      <td className="py-2 px-6">
                        <div className="flex items-center justify-center space-x-1">
                          {statusOption.map((statusData: string, i) => {
                            const stepIndex = i + 1;

                            let items: (typeof status)[] = [];

                            if (statusData === "ยกเลิก") {
                              // เอา entry ทั้งหมดที่ key ขึ้นต้นด้วย "ยกเลิก"
                              items = _(groupData)
                                .pickBy((_v, key) => key.startsWith("ยกเลิก"))
                                .values()
                                .flatten()
                                .value();
                            } else if (statusData === "ไม่สนใจ") {
                              // ถ้าต้องการรวม "ไม่สนใจ ..." ด้วย
                              items = _(groupData)
                                .pickBy((_v, key) => key.startsWith("ไม่สนใจ"))
                                .values()
                                .flatten()
                                .value();
                            } else {
                              // กรณีทั่วไป ใช้ตรงๆ
                              items = groupData[statusData] ?? [];
                            }
                            return (
                              <Tooltip
                                key={`${item.id}_${stepIndex}`}
                                enterTouchDelay={100}
                                leaveTouchDelay={3000}
                                title={statusData}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getStatusColor(
                                      items.length > 0,
                                      stepIndex
                                    )}`}
                                  >
                                    {stepIndex}
                                  </div>
                                  {/* {stepIndex < status.length - 1 && (
                                    <div className="w-4 h-0.5 bg-gray-300 mx-1"></div>
                                  )} */}
                                </div>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-2 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Coming soon... */}
                          {/* <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="ดู"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                            title="แก้ไข"
                          >
                            <FileText className="w-4 h-4" />
                          </button> */}
                          {/* <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout */}
        {/* <div className="block md:hidden">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="p-4 border-b border-gray-100 bg-white"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.school}</h3>
                    <p className="text-sm text-gray-600">
                      {item.district} - {item.province}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-full">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-full">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-1 overflow-x-auto">
                  {item.status.map((step, stepIndex) => (
                    <div key={step} className="flex items-center flex-shrink-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${getStatusColor(
                          step,
                          7
                        )}`}
                      >
                        {step}
                      </div>
                      {stepIndex < item.status.length - 1 && (
                        <div className="w-3 h-0.5 bg-gray-300 mx-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Pagination */}

        <div className="p-6 border-t border-gray-200 grid grid-cols-9 items-center justify-between">
          <div className="text-sm text-gray-600 col-span-2">
            แสดง {page * perPage - perPage + 1}-
            {Math.min(page * perPage, Object.keys(schoolData).length ?? 0)} จาก{" "}
            {Object.keys(schoolData).length ?? 0} รายการ
          </div>
          <div className="col-span-2"></div>
          <div></div>
          <div></div>

          <div className="flex justify-end space-x-2 col-span-3">
            <Pagination
              page={page}
              onChange={(e, v) => setPage(v)}
              count={Math.ceil((Object.keys(schoolData).length ?? 1) / perPage)}
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const FormPage = () => {
  return (
    <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {[
          {
            title: "Total Revenue",
            value: "฿124,500",
            change: "+12%",
            color: "text-green-600",
          },
          {
            title: "Active Users",
            value: "2,547",
            change: "+5%",
            color: "text-blue-600",
          },
          {
            title: "Orders",
            value: "1,234",
            change: "-2%",
            color: "text-red-600",
          },
          {
            title: "Products",
            value: "567",
            change: "+8%",
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2 truncate">
              {stat.title}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-lg md:text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span
                className={`text-xs md:text-sm font-medium ${stat.color} mt-1 sm:mt-0`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
            Revenue Overview
          </h2>
          <div className="h-48 md:h-64 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={36} className="text-blue-500 mx-auto mb-2" />
              <p className="text-sm md:text-base text-gray-600">
                Chart Component
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3 md:space-y-4">
            {[
              {
                action: "New user registered",
                time: "2 minutes ago",
                type: "user",
              },
              {
                action: "Order #1234 completed",
                time: "1 hour ago",
                type: "order",
              },
              {
                action: "Database backup completed",
                time: "3 hours ago",
                type: "system",
              },
              {
                action: "New message received",
                time: "5 hours ago",
                type: "message",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === "user"
                      ? "bg-green-500"
                      : activity.type === "order"
                      ? "bg-blue-500"
                      : activity.type === "system"
                      ? "bg-yellow-500"
                      : "bg-purple-500"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Product
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  id: "#1234",
                  customer: "สมชาย ใจดี",
                  product: "Product A",
                  amount: "฿1,500",
                  status: "completed",
                },
                {
                  id: "#1235",
                  customer: "สมหญิง สวยงาม",
                  product: "Product B",
                  amount: "฿2,300",
                  status: "pending",
                },
                {
                  id: "#1236",
                  customer: "สมศรี มีสุข",
                  product: "Product C",
                  amount: "฿800",
                  status: "processing",
                },
                {
                  id: "#1237",
                  customer: "สมพร รวยเงิน",
                  product: "Product D",
                  amount: "฿3,200",
                  status: "completed",
                },
              ].map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    <div className="truncate max-w-32 md:max-w-none">
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden sm:table-cell">
                    {order.product}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
