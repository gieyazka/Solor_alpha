"use client";
import React, { FormEventHandler, useEffect, useMemo, useState } from "react";
import {
  Save,
  Plus,
  Search,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  Building2,
  Zap,
  Calculator,
  FileText,
  CheckCircle,
  X,
  Download,
  FolderOpen,
  ArrowBigUp,
  Watch,
  Map,
} from "lucide-react";
import { useSchoolStore } from "@/stores";
import { AppwriteType, SchoolProps } from "@/@type";
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";
import clsx from "clsx";
import dayjs from "dayjs";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import {
  activityOption,
  connectLevel,
  coopLevel,
  decideLevel,
  easyLevel,
  locationLevel,
  materialLevel,
  paymentLevel,
  readyLevel,
  statusOption,
  structureLevel,
  understandLevel,
} from "@/utils/options";
import _ from "lodash";
import { columnToLetter } from "@/utils/excel";
import { updateMasterData } from "@/actions/excel";
import { formatNumber, parseNumber, toThaiNumber } from "@/utils/fn";
import { inputClasses, labelClasses, sectionClasses } from "@/utils/style";
import { usePathname, useSearchParams } from "next/navigation";
import { createSchool, getLastestId, updateSchool } from "@/actions/school";
import AddSchoolDialog from "./add_school";
import Swal from "sweetalert2";
type formProps = {
  statusArrObject: { status: string; date?: string; remark?: string }[];
  activityArrObject: { activity: string; date?: string }[];
  meterArrObject: { ca: string; kw_pk: string; rate: string }[];
  location: string;
};
export default function SolarCellForm() {
  const masterStore = useSchoolStore();
  const [hidden, setHidden] = useState(true);
  const pathname = usePathname();
  const [selectSchool, setSelectSchool] = useState<number | undefined>(
    undefined
  );
  const [openAddSchool, setOpenAddSchool] = useState(false);

  const handleAddSchool = async (schoolName: string) => {
    const matches = Object.keys(masterStore.masterDataKey).filter((k) =>
      k
        .replace(/\s+/g, "")
        .toLowerCase()
        .includes(schoolName.replace(/\s+/g, "").toLowerCase())
    );
    if (matches.length > 0) {
      Swal.fire({
        icon: "error",
        title: "มีโรงเรียนนี้อยู่แล้ว",
      });
      throw "School already exists";
    }

    try {
      const lastId = await getLastestId();

      const res = await createSchool({
        id: lastId ? lastId + 1 : 1,
        school_name: schoolName,
      });

      masterStore.addSchoolRow({ data: res! });
      Swal.fire({
        icon: "success",
        title: "เพิ่มโรงเรียนใหม่เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error adding school:", error);
    }

    // TODO: Call API หรือเพิ่มข้อมูลใน state
  };

  useEffect(() => {
    const target = document.getElementById("topForm");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting);
      },
      {
        root: null, // viewport
        threshold: 0.3, // กี่ % ของ section ที่เข้า viewport ถึงจะถือว่า "intersecting"
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);
  // console.log("masterStore.", masterStore.masterData[0]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm<Partial<SchoolProps> & formProps>({
    defaultValues: {
      statusArrObject: [{ status: "", date: "" }],
      activityArrObject: [{ activity: "", date: "" }],
      meterArrObject: [{ ca: "", kw_pk: "", rate: "" }],
    },
  });

  const openMap = (schoolName: string, lat: string, lng: string) => {
    // const encodedLabel = encodeURIComponent(schoolName);
    const url = `https://www.google.com/maps/search/?api=1&query=${schoolName}%20@${lat},${lng}`;
    // const url = `https://www.google.com/maps/place/${encodedLabel}/@${lat},${lng},${17}z/data=!3m1!4b1?q=${lat},${lng}`;
    console.log("url", url);
    window.open(url, "_blank");
  };

  const onSubmit: SubmitHandler<
    Partial<AppwriteType<SchoolProps>> & formProps
  > = async (d) => {
    let data = d;
    const [lat, lng] = data.location?.split(",") ?? [];
    data.latitude = lat ? parseFloat(lat) : undefined;
    data.longitude = lng ? parseFloat(lng) : undefined;
    // console.log("data", data.$id);
    const formatData: SchoolProps = {
      id: data.id!,
      no: data.no!,
      solarEst: data.solarEst,
      location_checked:
        typeof data.location_checked === "string"
          ? (data.location_checked as string).toUpperCase() === "YES"
            ? true
            : (data.location_checked as string).toUpperCase() === "NO"
            ? false
            : undefined
          : data.location_checked,
      school_name: data.school_name!,
      school_address: data.school_address,
      subdistrict: data.subdistrict,
      district: data.district,
      province: data.province,
      post_code: data.post_code,
      total_students: data.total_students
        ? parseInt(data.total_students.toString())
        : undefined,
      school_region: data.school_region,
      school_affiliation: data.school_affiliation,
      school_district: data.school_district,
      electricity_provider: data.electricity_provider,
      power_rate: data.power_rate
        ? parseFloat(data.power_rate.toString())
        : undefined,
      ca: data.ca,
      operation_status: data.operation_status,
      contact_email: data.contact_email,
      school_contact_name: data.school_contact_name,
      school_contact_position: data.school_contact_position,
      school_contact_phone: data.school_contact_phone,
      school_director: data.school_director,
      school_director_phone: data.school_director_phone,
      electricity_avg_month: data.electricity_avg_month
        ? parseFloat(data.electricity_avg_month.toString().replaceAll(/,/g, ""))
        : undefined,
      investor_name: data.investor_name,
      moe_doc_no: data.moe_doc_no,
      moe_doc_date: data.moe_doc_date,
      pea_no: data.pea_no,
      pea_date: data.pea_date,
      cover_sheet_no: data.cover_sheet_no,
      cover_sheet_date: data.cover_sheet_date,
      book_no: data.book_no,
      book_date: data.book_date,
      moe_proposal_no: data.moe_proposal_no,
      proposal_date: data.proposal_date,
      simulation: data.simulation,
      latitude: data.latitude
        ? parseFloat(data.latitude.toString())
        : undefined,
      longitude: data.longitude
        ? parseFloat(data.longitude.toString())
        : undefined,
      status: data.statusArrObject.map((d) => {
        if (d.status === "ยกเลิก" || d.status === "ไม่สนใจ") {
          d.status += ` ${d.remark}`;
        }
        delete d.remark;
        return JSON.stringify(d);
      }),
      activity: data.activityArrObject.map((d) => JSON.stringify(d)),
      meter: data.meterArrObject.map((d) => JSON.stringify(d)),
      total_kw_pk: data.total_kw_pk
        ? parseFloat(data.total_kw_pk.toString())
        : undefined,
      esco_understanding_score: data.esco_understanding_score
        ? parseInt(data.esco_understanding_score.toString())
        : undefined,
      score_cooperation: data.score_cooperation
        ? parseInt(data.score_cooperation.toString())
        : undefined,
      score_decision_power: data.score_decision_power
        ? parseInt(data.score_decision_power.toString())
        : undefined,
      score_data_readiness: data.score_data_readiness
        ? parseInt(data.score_data_readiness.toString())
        : undefined,
      score_electricity_arrears: data.score_electricity_arrears
        ? parseInt(data.score_electricity_arrears.toString())
        : undefined,
      note_school: data.note_school,
      score_install_area: data.score_install_area
        ? parseInt(data.score_install_area?.toString())
        : undefined,
      score_roof_material: data.score_roof_material
        ? parseInt(data.score_roof_material?.toString())
        : undefined,
      score_structure: data.score_structure
        ? parseInt(data.score_structure?.toString())
        : undefined,
      score_connection_wiring: data.score_connection_wiring
        ? parseInt(data.score_connection_wiring?.toString())
        : undefined,
      score_site_access: data.score_site_access
        ? parseInt(data.score_site_access?.toString())
        : undefined,
      note_site: data.note_site,
      score_total: data.score_total
        ? parseInt(data.score_total?.toString())
        : undefined,
      link_invitation: data.link_invitation,
      link_acceptance: data.link_acceptance,
      link_proposal: data.link_proposal,
    };
    // console.log("formatData", formatData);
    // return;
    try {
      const res = await updateSchool({
        id: String(data.$id),
        data: formatData,
      });
      // TODO: update data
      Swal.fire({
        icon: "success",
        title: "เขียนข้อมูลสำเร็จ",
      });
      const section = document.getElementById("topForm");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      masterStore.updateData({
        id: String(data.id),
        data: res as AppwriteType<SchoolProps>,
      });
      reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เขียนข้อมูลไม่สำเร็จ",
      });
      console.log("error", error);

      // window.location.reload();
    }
  };

  const statusFieldArr = useFieldArray({
    control,
    name: "statusArrObject",
  });
  const activityFieldArr = useFieldArray({
    control,
    name: "activityArrObject",
  });
  const meterFieldArr = useFieldArray({
    control,
    name: "meterArrObject",
  });

  const handleChangeSchool = (data: SchoolProps[] | undefined) => {
    console.log("data", data?.[0]);
    clearQuery();
    setSelectSchool(data?.[0]?.id || undefined);
    const d = data?.[0];
    if (d && d.school_name) {
      if (d?.activity) {
        const status = d.activity.map((d) => JSON.parse(d)) as {
          activity: string;
          date: string;
        }[];
        activityFieldArr.replace(status);
        status.map((d, i) => {
          setValue(`activityArrObject.${i}.activity`, d.activity);
          setValue(`activityArrObject.${i}.date`, d.date);
        });
      }
      const findSchoolByKey = masterStore.masterDataKey[d.school_name];

      Object.keys(d).forEach((k) => {
        const key: keyof SchoolProps = k as keyof SchoolProps;
        if (
          key === "moe_doc_date" ||
          key === "pea_date" ||
          key === "cover_sheet_date" ||
          key === "book_date" ||
          key === "proposal_date"
        ) {
          console.log("d[key]", key, d[key]);
          if (d[key]?.includes("/")) {
            const [day, month, year] = d[key]?.split("/");
            const date = `${year}-${month.padStart(2, "0")}-${day.padStart(
              2,
              "0"
            )}`;
            setValue(key, date);
          } else {
            setValue(key, d[key]);
          }
        } else {
          setValue(key, d[key]);
        }
      });

      if (findSchoolByKey[0].meter?.length === 0) {
        const meterData: {
          ca: string;
          kw_pk: string;
          rate: string;
        }[] = [];
        let sumPk = 0;
        // findSchoolByKey.forEach((school) => {
        //   meterData.push({
        //     ca: String(school.ca),
        //     kw_pk: String(school.k),
        //     rate: String(school["อัตรา"]),
        //   });
        //   sumPk += Number(school.KW_PK) || 0;
        // });
        // setValue("รวมKW_PK", String(sumPk));
        meterFieldArr.replace([{ ca: "", kw_pk: "", rate: "" }]);
      } else {
        const meterData = findSchoolByKey[0].meter?.map((d) => JSON.parse(d));
        meterData && meterFieldArr.replace(meterData);

        if (
          findSchoolByKey[0]["total_kw_pk"] !== null &&
          findSchoolByKey[0]["total_kw_pk"] !== undefined
        ) {
          setValue("total_kw_pk", findSchoolByKey[0]["total_kw_pk"]);
        } else {
          let sumPk = 0;
          meterData &&
            meterData.forEach(
              (meter: { ca: string; kw_pk: string; rate: string }) => {
                sumPk += Number(meter.kw_pk) || 0;
              }
            );
          setValue("total_kw_pk", sumPk);
        }
      }

      if (findSchoolByKey[0].status!.length > 0) {
        const statusData: {
          status: string;
          date?: string;
          remark?: string;
        }[] = [];

        findSchoolByKey[0].status!.forEach((status) => {
          const parseStatus = JSON.parse(status) as {
            status: string;
            date: string;
          };
          const findStatus = statusOption.some((d) => d === parseStatus.status);
          if (!findStatus) {
            const [status, remark] = parseStatus.status.split(" ");
            statusData.push({
              status: String(status),
              date: String(parseStatus.date),
              remark: remark,
            });
          } else {
            statusData.push({
              status: String(parseStatus.status),
              date: String(parseStatus.date),
              remark: "",
            });
          }
        });
        statusFieldArr.replace(statusData);
        statusData.map((d, i) => {
          setValue(`statusArrObject.${i}.status`, d.status);
          setValue(`statusArrObject.${i}.date`, d.date);
        });
      } else {
        const status = d.status?.map((a) => JSON.parse(a)) as {
          status: string;
          date: string;
        }[];
        statusFieldArr.replace(
          status.length > 0
            ? status
            : [
                {
                  status: "",
                  date: "",
                },
              ]
        );
        status.map((d, i) => {
          setValue(`statusArrObject.${i}.status`, d.status);
          setValue(`statusArrObject.${i}.date`, d.date);
        });
      }

      if (findSchoolByKey[0].activity!.length > 0) {
        const statusData: {
          activity: string;
          date?: string;
        }[] = [];

        findSchoolByKey[0].activity!.forEach((activity) => {
          const parseActivity = JSON.parse(activity) as {
            activity: string;
            date: string;
          };
          statusData.push({
            activity: String(parseActivity.activity),
            date: String(parseActivity.date),
          });
          // setValue(
          //   `activityArrObject.${0}.activity`,
          //   String(parseActivity.activity)
          // );
          // setValue(`activityArrObject.${0}.date`, String(parseActivity.date));
        });
        activityFieldArr.replace(statusData);
      } else {
        const status = d.activity?.map((a) => JSON.parse(a)) as {
          activity: string;
          date: string;
        }[];
        status.map((d, i) => {
          setValue(`activityArrObject.${i}.activity`, d.activity);
          setValue(`activityArrObject.${i}.date`, d.date);
        });
        activityFieldArr.replace(
          status.length > 0
            ? status
            : [
                {
                  activity: "",
                  date: "",
                },
              ]
        );
      }
      setValue(
        "location",
        `${findSchoolByKey[0].latitude},${findSchoolByKey[0].longitude}`
      );
    } else {
      reset();
    }
  };
  // console.log("watch()", watch());
  const meterValues = watch("meterArrObject");
  useEffect(() => {
    const sum = _.sumBy(meterValues, (item) => parseFloat(item.kw_pk));
    setValue("total_kw_pk", sum || 0);
  }, [meterValues]);

  const params = useSearchParams();
  const school = params.get("school") || undefined;

  useEffect(() => {
    if (school) {
      const findSchoolById = masterStore.masterData.find(
        (d) => d.id.toString() === school
      );
      if (findSchoolById?.["school_name"]) {
        handleChangeSchool(
          masterStore.masterDataKey[findSchoolById["school_name"]]
        );
      }
    }
  }, [school, masterStore.masterData]);

  const clearQuery = () => {
    // เปลี่ยน URL เท่านั้น ไม่ reload หรือ redirect ใดๆ
    window.history.replaceState(
      null,
      "",
      // เอาเฉพาะ path ไม่มี ?query
      pathname
    );
  };

  const watchedValues = watch([
    "esco_understanding_score",
    "score_cooperation",
    "score_decision_power",
    "score_data_readiness",
    "score_electricity_arrears",
    "score_install_area",
    "score_roof_material",
    "score_structure",
    "score_connection_wiring",
    "score_site_access",
  ]);
  useEffect(() => {
    let score = 0;

    watchedValues.forEach((v) => {
      if (v) score += v * 2;
    });

    // ✅ ป้องกันลูป: ถ้าคะแนนไม่เปลี่ยน → ไม่ต้อง setValue ใหม่
    const currentScore = watch("score_total") || 0;
    if (currentScore !== score) {
      setValue("score_total", score);
    }
  }, [watchedValues, setValue]);

  const statusArr = watch("status");
  const lastStatus =
    Array.isArray(statusArr) && statusArr.length > 0
      ? (() => {
          const last = _.last(statusArr);
          return last ? JSON.parse(last).status : undefined;
        })()
      : undefined;
  // console.log("watch()", watch());
  return (
    <div className="relative pt-2 min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-8">
      <AddSchoolDialog
        onClose={() => setOpenAddSchool(false)}
        onSubmit={handleAddSchool}
        open={openAddSchool}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  ">
        <div id={`topForm`} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-12 w-12 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              แบบฟอร์มติดตาม Solar Cell
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            ระบบติดตามการติดตั้งพลังงานแสงอาทิตย์ในสถานศึกษา
          </p>
        </div>
        <div className="text-end m-2">
          <Button onClick={() => setOpenAddSchool(true)} variant="outlined">
            Add School
          </Button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          {/* ข้อมูลโรงเรียน */}
          <div className={sectionClasses}>
            <div className="flex items-center mb-4 sm:mb-6">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                ข้อมูลสถานศึกษา
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>ชื่อโรงเรียน</label>
                  <SchoolAutoComplete
                    value={watch("school_name")}
                    readOnly={false}
                    masterDataKey={masterStore.masterDataKey}
                    handleChangeSchool={handleChangeSchool}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ตรวจสอบสถานที่</label>
                  {/* <input
                    type="text"
                    className={inputClasses}
                    placeholder="ตรวจสอบสถานที่"
                    {...register("location_checked")}
                  /> */}

                  <select
                    className={inputClasses}
                    {...register(`location_checked`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                <div className="flex flex-col text-left  gap-2">
                  <label className={labelClasses}>Status</label>
                  <p className=" ">{lastStatus}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>ที่อยู่</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ที่อยู่"
                    {...register("school_address")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ชื่อตำบล</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ชื่อตำบล"
                    {...register("subdistrict")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ชื่ออำเภอ</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="อำเภอ"
                    {...register("district")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ชื่อจังหวัด</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="จังหวัด"
                    {...register("province")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="รหัสไปรษณีย์"
                    maxLength={5}
                    {...register("post_code")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ภาค</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ภาค"
                    {...register("school_region")}
                  />
                </div>

                <div>
                  <label className={labelClasses}>จำนวนนักเรียน</label>
                  <input
                    type="number"
                    className={inputClasses}
                    placeholder="จำนวนนักเรียน"
                    {...register("total_students")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ค่าไฟเฉลี่ย/เดือน</label>
                  <Controller
                    name="electricity_avg_month"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        inputMode="numeric"
                        className={inputClasses}
                        placeholder="บาท/เดือน"
                        value={field.value || ""}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/,/g, "");

                          const withComma = formatNumber(raw);
                          field.onChange(withComma);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>สังกัด</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="สังกัด"
                    {...register("school_affiliation")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>เขต</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="เขต"
                    {...register("school_district")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>กฟภ.</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="กฟภ."
                    {...register("electricity_provider")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>รวมKW_PK</label>
                  <input
                    readOnly={true}
                    type="text"
                    className={inputClasses}
                    placeholder="รวมKW_PK"
                    {...register("total_kw_pk")}
                  />
                </div>
              </div>

              {meterFieldArr.fields.map((data, index) => {
                return (
                  <div
                    key={data.id}
                    className="flex sm:flex-row flex-col gap-2"
                  >
                    <div className="flex-1">
                      {index === 0 && (
                        <label className={labelClasses}>อัตรา</label>
                      )}
                      <input
                        type="text"
                        className={inputClasses}
                        placeholder="อัตรา"
                        {...register(`meterArrObject.${index}.rate`)}
                      />
                    </div>
                    <div className="flex-1">
                      {index === 0 && (
                        <label className={labelClasses}>CA</label>
                      )}
                      <input
                        type="text"
                        className={inputClasses}
                        placeholder="CA"
                        {...register(`meterArrObject.${index}.ca`)}
                      />
                    </div>

                    <div className="flex-1">
                      {index === 0 && (
                        <label className={labelClasses}>KW_PK</label>
                      )}
                      <input
                        type="number"
                        inputMode="numeric"
                        className={inputClasses}
                        placeholder="กำลังไฟฟ้า (KW)"
                        step="0.001"
                        {...register(`meterArrObject.${index}.kw_pk`)}
                        onChange={(e) => {
                          const input = e.target.value;

                          let total = _.sumBy(
                            _.filter(
                              meterFieldArr.fields,
                              (_v, i) => i !== index
                            ),
                            "kw_pk"
                          );

                          const sum =
                            (Number(total) || 0) + (Number(input) || 0);

                          setValue("total_kw_pk", sum);
                          setValue(`meterArrObject.${index}.kw_pk`, input);
                        }}
                      />
                    </div>
                    <div className="pb-1 flex gap-2 items-end">
                      {index !== 0 ? (
                        <Button
                          onClick={() => meterFieldArr.remove(index)}
                          color="error"
                          className="h-fit  "
                          variant="contained"
                        >
                          {" "}
                          <X className="" />{" "}
                        </Button>
                      ) : (
                        <div className="w-16"></div>
                      )}
                      <Button
                        onClick={() =>
                          meterFieldArr.append({
                            ca: "",
                            kw_pk: "",
                            rate: "",
                          })
                        }
                        className="h-fit "
                        variant="contained"
                      >
                        {" "}
                        <X className="rotate-45" />{" "}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ข้อมูลการติดต่อ */}
          <div className={sectionClasses}>
            <div className="flex items-center mb-4 sm:mb-6">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                ข้อมูลการติดต่อ
              </h2>
            </div>

            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                ข้อมูลผู้ประสานงานโรงเรียน
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>ชื่อผู้ประสานงาน</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ชื่อ-สกุล"
                    {...register("school_contact_name")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ตำแหน่ง</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ตำแหน่ง"
                    {...register("school_contact_position")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    เบอร์ติดต่อผู้ประสานงาน
                  </label>
                  <input
                    type="tel"
                    className={inputClasses}
                    placeholder="เบอร์โทรศัพท์"
                    {...register("school_contact_phone")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                ข้อมูลผู้อำนวยการ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>
                    ชื่อผู้อำนวยการโรงเรียน
                  </label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ชื่อ-สกุล ผู้อำนวยการ"
                    {...register("school_director")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>เบอร์ติดต่อ ผอ.</label>
                  <input
                    type="tel"
                    className={inputClasses}
                    placeholder="เบอร์โทรศัพท์ ผอ."
                    {...register("school_director_phone")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className={labelClasses}>E-mail / Line</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="Email / Line"
                  {...register("contact_email")}
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลพื้นฐาน */}
          {/* <div className={sectionClasses}>
            <div className="flex items-center mb-4 sm:mb-6">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                ข้อมูลพื้นฐาน
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <label className={labelClasses}>ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="รหัสประจำตัว"
                />
              </div>
              <div>
                <label className={labelClasses}>ลำดับประมาณการติดตั้ง</label>
                <input
                  type="number"
                  name="installOrder"
                  value={formData.installOrder}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="ลำดับ"
                />
              </div>
              <div>
                <label className={labelClasses}>Solar cell KW_PK</label>
                <input
                  type="number"
                  name="solarKW"
                  value={formData.solarKW}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="กำลังไฟฟ้า (KW)"
                  step="0.1"
                />
              </div>
              <div>
                <label className={labelClasses}>จำนวนนักเรียน</label>
                <input
                  type="number"
                  name="studentCount"
                  value={formData.studentCount}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="จำนวนนักเรียน"
                />
              </div>
            </div>
          </div> */}

          {/* สถานะและกิจกรรม */}
          <div className={`!bg-purple-200 ${clsx(sectionClasses)}`}>
            <div className="flex items-center mb-4 sm:mb-6">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                สถานะและกิจกรรม
              </h2>
            </div>

            <div>
              <label className={labelClasses}>การดำเนินงาน</label>
              <textarea
                className={`${inputClasses} h-12`}
                placeholder="การดำเนินงาน"
                {...register("operation_status")}
              />
            </div>
            <div className=" gap-2 mt-4 flex relative items-end">
              <div className="w-full space-y-2">
                <label className={labelClasses}>Status</label>
                {statusFieldArr.fields.map(
                  (data: { status: string; date?: string }, index: number) => {
                    return (
                      <div key={index} className="flex gap-2 ">
                        <select
                          className={inputClasses}
                          {...register(`statusArrObject.${index}.status`)}
                        >
                          <option value="">เลือกสถานะ</option>
                          {statusOption.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {(watch(`statusArrObject.${index}.status`) ===
                          "ยกเลิก" ||
                          watch(`statusArrObject.${index}.status`) ===
                            "ไม่สนใจ") && (
                          <input
                            type="text"
                            className={inputClasses}
                            placeholder="เหตุผล"
                            {...register(`statusArrObject.${index}.remark`)}
                          />
                        )}
                        <input
                          type="date"
                          className={inputClasses}
                          placeholder="วันที่"
                          {...register(`statusArrObject.${index}.date`)}
                        />

                        <div className="pb-1 flex gap-2 items-end">
                          <Button
                            onClick={() => {
                              if (statusFieldArr.fields.length === 1) {
                                statusFieldArr.update(index, {
                                  status: "",
                                  date: "",
                                });
                                setValue(`statusArrObject.${index}.status`, "");
                                setValue(`statusArrObject.${index}.date`, "");
                              } else {
                                statusFieldArr.remove(index);
                              }
                            }}
                            color="error"
                            className="h-fit  "
                            variant="contained"
                          >
                            {" "}
                            <X className="" />{" "}
                          </Button>
                          {/* {index !== 0 ? (
                            <Button
                              onClick={() => statusFieldArr.remove(index)}
                              color="error"
                              className="h-fit  "
                              variant="contained"
                            >
                              {" "}
                              <X className="" />{" "}
                            </Button>
                          ) : (
                            <div className="w-16"></div>
                          )} */}
                          <Button
                            onClick={() =>
                              statusFieldArr.append({
                                status: "",
                                date: "",
                              })
                            }
                            className="h-fit "
                            variant="contained"
                          >
                            {" "}
                            <X className="rotate-45" />{" "}
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4 relative items-end">
              <div className="w-full space-y-2">
                <label className={labelClasses}>Activity</label>
                {activityFieldArr.fields.map(
                  (
                    data: { activity: string; date?: string },
                    index: number
                  ) => {
                    return (
                      <div key={index} className="flex gap-2 ">
                        <select
                          className={inputClasses}
                          {...register(`activityArrObject.${index}.activity`)}
                        >
                          <option value="">เลือกสถานะ</option>
                          {activityOption.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <input
                          type="date"
                          className={inputClasses}
                          placeholder="วันที่"
                          {...register(`activityArrObject.${index}.date`)}
                        />
                        <div className="pb-1 flex gap-2 items-end">
                          <Button
                            onClick={() => {
                              if (activityFieldArr.fields.length === 1) {
                                activityFieldArr.update(index, {
                                  activity: "",
                                  date: "",
                                });
                                setValue(
                                  `activityArrObject.${index}.activity`,
                                  ""
                                );
                                setValue(`activityArrObject.${index}.date`, "");
                              } else {
                                activityFieldArr.remove(index);
                              }
                            }}
                            color="error"
                            className="h-fit  "
                            variant="contained"
                          >
                            {" "}
                            <X className="" />{" "}
                          </Button>

                          {/* {index !== 0 ? (
                            <Button
                              onClick={() => activityFieldArr.remove(index)}
                              color="error"
                              className="h-fit  "
                              variant="contained"
                            >
                              {" "}
                              <X className="" />{" "}
                            </Button>
                          ) : (
                            <div className="w-16"></div>
                          )} */}
                          <Button
                            onClick={() =>
                              activityFieldArr.append({
                                activity: "",
                                date: "",
                              })
                            }
                            className="h-fit "
                            variant="contained"
                          >
                            {" "}
                            <X className="rotate-45" />{" "}
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className={`!bg-pink-100 ${clsx(sectionClasses)}`}>
            <div className="flex items-center mb-4 sm:mb-6">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                การประเมินโรงเรียน
              </h2>
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                ความพร้อมของทีมผู้บริหาร
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>
                    ความเข้าใจในโมเดล ESCO (10%)
                  </label>

                  <select
                    className={inputClasses}
                    {...register(`esco_understanding_score`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {understandLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>
                    ระดับความร่วมมือของโรงเรียน (10%)
                  </label>
                  <select
                    className={inputClasses}
                    {...register(`score_cooperation`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {coopLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>
                    การตัดสินใจและอำนาจภายใน (10%)
                  </label>
                  <select
                    className={inputClasses}
                    {...register(`score_decision_power`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {decideLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>
                    ความพร้อมในการให้ข้อมูล (10%)
                  </label>
                  <select
                    className={inputClasses}
                    {...register(`score_data_readiness`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {readyLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>การค้างค่าไฟฟ้า (10%)</label>
                  <select
                    className={inputClasses}
                    {...register(`score_electricity_arrears`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {paymentLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className={labelClasses}>หมายเหตุ</label>

                <textarea
                  className={`${inputClasses} h-12`}
                  placeholder="หมายเหตุ"
                  {...register("note_school")}
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                ความพร้อมของการติดตั้ง
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>
                    พื้นที่ติดตั้งที่มีอยู่ (10%)
                  </label>

                  <select
                    className={inputClasses}
                    {...register(`score_install_area`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {locationLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>
                    สภาพวัสดุมุงหลังคา (10%)
                  </label>
                  <select
                    className={inputClasses}
                    {...register(`score_roof_material`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {materialLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>สภาพโครงสร้าง (10%)</label>
                  <select
                    className={inputClasses}
                    {...register(`score_structure`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {structureLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>
                    จุดเชื่อมต่อและการเดินสายไฟ (10%)
                  </label>
                  <select
                    className={inputClasses}
                    {...register(`score_connection_wiring`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {connectLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>
                    การเข้าถึงหน้างาน (10%)
                  </label>
                  <select
                    className={inputClasses}
                    {...register(`score_site_access`)}
                  >
                    <option value="">เลือกสถานะ</option>
                    {easyLevel.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className={labelClasses}>หมายเหตุ</label>
                <textarea
                  className={`${inputClasses} h-12`}
                  placeholder="หมายเหตุ"
                  {...register("note_site")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div>
                <label className={labelClasses}>Score 100 %</label>
                <input
                  readOnly
                  type="number"
                  className={inputClasses}
                  placeholder="0-10"
                  min="0"
                  max="100"
                  {...register(`score_total`)}
                />
              </div>
            </div>
          </div>
          {/* เอกสารและข้อเสนอ */}
          <div className={sectionClasses}>
            <div className="flex items-center mb-4 sm:mb-6">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                เอกสารและข้อเสนอ
              </h2>
            </div>

            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {/* <div>
                <label className={labelClasses}>
                  ข้อเสนอโครงการที่ออกจาก PEA
                </label>
                <input
                  type="text"
                  name="peaProjectProposal"
                  value={formData["ข้อเสนอโครงการที่ออกจาก PEA"] || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="ข้อเสนอจาก PEA"
                />
              </div>
              <div>
                <label className={labelClasses}>PEA</label>
                <input
                  type="text"
                  name="pea"
                  value={formData["PEA"] || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="PEA"
                />
              </div> */}
              {/* <div>
                <label className={labelClasses}>Focus</label>
                <input
                  type="text"
                  name="focus"
                  value={formData["Focus"] || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Focus"
                />
              </div> */}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              ใบตอบรับหนังสือเชิญ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label className={labelClasses}>เลขที่</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="เลขที่เอกสาร"
                  {...register("pea_no")}
                />
              </div>
              <div>
                <label className={labelClasses}>วันที่</label>
                <input
                  type="date"
                  className={inputClasses}
                  {...register("pea_date")}
                />
              </div>
              <div>
                <label className={labelClasses}>เลขที่ ศธ.</label>
                {/* <input
                  type="text"
                  className={inputClasses}
                  placeholder="เลขที่เอกสาร ศธ."
                  {...register("เลขที่ ศธ.")}
                /> */}
                <Controller
                  name="moe_doc_no"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      // inputMode="numeric"
                      className={inputClasses}
                      placeholder="เลขที่ ศธ."
                      value={field.value || ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");

                        const withComma = toThaiNumber(raw);
                        field.onChange(withComma);
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <label className={labelClasses}>วันที่ตอบกลับ</label>
                <input
                  type="date"
                  className={inputClasses}
                  {...register("moe_doc_date")}
                />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold  text-gray-800 mt-4 mb-3 sm:mb-4">
              ใบปะหน้าข้อเสนอ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 sm:gap-4">
              <div>
                <label className={labelClasses}>เลขที่ มท</label>
                {/* <input
                  type="text"
                  className={inputClasses}
                  placeholder="เลขที่ มท"
                  {...register("เลขที่ใบปะหน้า")}
                /> */}
                <Controller
                  name="cover_sheet_no"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      // inputMode="numeric"
                      className={inputClasses}
                      placeholder="เลขที่ มท"
                      value={field.value || ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");

                        const withComma = toThaiNumber(raw);
                        field.onChange(withComma);
                      }}
                    />
                  )}
                />
              </div>

              <div>
                <label className={labelClasses}>วันที่</label>
                <input
                  type="date"
                  className={inputClasses}
                  {...register("cover_sheet_date")}
                />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold  text-gray-800 mt-4 mb-3 sm:mb-4">
              ใบตอบรับข้อเสนอและร่างสัญญา
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 sm:gap-4">
              <div>
                <label className={labelClasses}>เลขที่</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="เลขที่เอกสาร"
                  {...register("book_no")}
                />
              </div>
              <div>
                <label className={labelClasses}>วันที่ตอบกลับ</label>
                <input
                  type="date"
                  className={inputClasses}
                  {...register("book_date")}
                />
              </div>
              <div>
                <label className={labelClasses}>เลขที่ ศธ.</label>
                {/* <input
                  type="text"
                  className={inputClasses}
                  placeholder="เลขที่เอกสาร ศธ."
                  {...register("เลขที่ ศธ ข้อเสนอ")}
                /> */}

                <Controller
                  name="moe_proposal_no"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      // inputMode="numeric"
                      className={inputClasses}
                      placeholder="เลขที่ ศธ."
                      value={field.value || ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");

                        const withComma = toThaiNumber(raw);
                        field.onChange(withComma);
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <label className={labelClasses}>วันที่ตอบกลับ</label>
                <input
                  type="date"
                  className={inputClasses}
                  {...register("proposal_date")}
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                ข้อเสนอและการจำลอง
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>Simulation</label>
                  <textarea
                    className={`${inputClasses} h-12 `}
                    placeholder="รายละเอียดการจำลอง"
                    {...register("simulation")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Link หนังสือเชิญ</label>
                  <div className="flex gap-2 ">
                    <input
                      type="text"
                      className={inputClasses}
                      {...register("link_acceptance")}
                    />
                    <IconButton
                      onClick={() => {
                        window.open(watch(`link_acceptance`), "_blank");
                      }}
                      color="primary"
                    >
                      <FolderOpen className="w-5 h-5" />
                    </IconButton>
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>
                    Link หนังสือตอบรับข้อเสนอ
                  </label>

                  <div className="flex gap-2 ">
                    <input
                      type="text"
                      className={inputClasses}
                      {...register("link_proposal")}
                    />
                    <IconButton
                      onClick={() => {
                        window.open(watch(`link_proposal`), "_blank");
                      }}
                      color="primary"
                    >
                      <FolderOpen className="w-5 h-5" />
                    </IconButton>
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Link ข้อเสนอโครงการ</label>

                  <div className="flex gap-2 ">
                    <input
                      type="text"
                      className={inputClasses}
                      {...register("link_invitation")}
                    />
                    <IconButton
                      onClick={() => {
                        window.open(watch(`link_invitation`), "_blank");
                      }}
                      color="primary"
                    >
                      <FolderOpen className="w-5 h-5" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* พิกัดและข้อมูลเพิ่มเติม */}
          <div className={sectionClasses}>
            <div className="flex items-center mb-4 sm:mb-6">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600 mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                พิกัดและข้อมูลเพิ่มเติม
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
              {/* <div>
                <label className={labelClasses}>Latitude</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="ละติจูด"
                  {...register("Latitude")}
                />
              </div>
              <div>
                <label className={labelClasses}>Longitude</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="ลองจิจูด"
                  {...register("Longitude")}
                />
              </div> */}

              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className={labelClasses}>
                    ตำแหน่ง Latitude,Longitude
                  </label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ตำแหน่ง"
                    {...register("location")}
                  />
                </div>
                <button
                  type="button"
                  className=" bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-full shadow-lg transition-all"
                  onClick={() => {
                    openMap(
                      String(watch("school_address")),
                      String(watch("latitude")),
                      String(watch("longitude"))
                    );
                  }}
                >
                  <Map />
                </button>
              </div>
              {/* <div>
                <label className={labelClasses}>Check Status</label>
                <select
                  name="checkStatus"
                  value={formData["chk"] || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option value="">เลือกสถานะ</option>
                  <option value="ผ่าน">ผ่าน</option>
                  <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                  <option value="รอตรวจ">รอตรวจ</option>
                </select>
              </div> */}
              {/* <div>
                <label className={labelClasses}>หนังสือตอบรับ</label>
                <select
                  name="responseLetterCheck"
                  value={formData.responseLetterCheck}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option value="">เลือกสถานะ</option>
                  <option value="ได้รับแล้ว">ได้รับแล้ว</option>
                  <option value="รอรับ">รอรับ</option>
                  <option value="ไม่ได้รับ">ไม่ได้รับ</option>
                </select>
              </div> */}
            </div>
          </div>
          {!hidden && (
            <button
              type="button"
              className="fixed  bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-full shadow-lg transition-all"
              onClick={() => {
                const section = document.getElementById("topForm");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <ArrowBigUp />
            </button>
          )}
          {/* ปุ่มบันทึก */}
          <div className="flex justify-center pt-6 sm:pt-8">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              {isSubmitting ? (
                "กำลังส่ง..."
              ) : (
                <>
                  <Save className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  บันทึกข้อมูล
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const SchoolAutoComplete = (props: {
  readOnly: boolean;
  value: any;
  masterDataKey: Record<string, AppwriteType<SchoolProps>[]>;
  handleChangeSchool: (d: AppwriteType<SchoolProps>[] | undefined) => void;
}) => {
  const { masterDataKey, readOnly = false } = props;
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      // setLoading(true);
      // await sleep(1e3); // For demo purposes.
      // setLoading(false);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    // setOptions([]);
  };

  const optionScool = React.useMemo(() => {
    const cloneData = _.cloneDeep(masterDataKey);
    if (inputValue !== "") {
      return Object.keys(cloneData)
        .filter((key) => key.includes(inputValue))
        .splice(0, 49);
    }
    return Object.keys(cloneData).splice(0, 21);
  }, [inputValue, masterDataKey]);
  // const optionScool = schoolQuery.data?.map((d) => {
  //   return d;
  // });
  return (
    <Autocomplete
      readOnly={readOnly}
      freeSolo
      // sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={(event, value) => {
        setInputValue(value);
      }}
      // isOptionEqualToValue={(option, value) => {
      //   return option?.["ชื่อโรงเรียน"] === value?.["ชื่อโรงเรียน"];
      // }}
      onChange={(event: any, newValue) => {
        if (newValue) {
          const findSchool = masterDataKey[newValue];
          props.handleChangeSchool(findSchool);
        } else {
          props.handleChangeSchool(undefined);
        }
      }}
      getOptionKey={(option) =>
        typeof option === "object" && option !== null && "id" in option
          ? (option as SchoolProps).id
          : String(option)
      }
      getOptionLabel={(option) =>
        typeof option === "object" && option !== null && "school_name" in option
          ? (option as SchoolProps)["school_name"]
          : String(option)
      }
      value={props.value ?? ""}
      options={optionScool ?? []}
      // loading={schoolQuery.isFetching}
      renderInput={(params) => (
        <TextField
          {...params}
          // label="ชื่อสถานศึกษา"
          placeholder="ชื่อสถานศึกษา"
          variant="standard"
          // InputLabelProps={{ shrink: true }}
          onBlur={(event: any) => {
            // const findSchool = optionScool.find(
            //   (d) => d.ชื่อโรงเรียน === event.target.value
            // );
            const findSchool = masterDataKey[event.target.value];

            props.handleChangeSchool(findSchool);
          }}
          slotProps={{
            input: {
              ...params.InputProps,

              disableUnderline: true,
              className: clsx(
                params.inputProps?.className, // ✅ สำคัญ: รักษา default class ของ MUI ไว้
                "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              ),
            },
            root: {
              className: "w-full",
            },
          }}
        />
      )}
    />
  );
};
