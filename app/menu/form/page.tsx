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
} from "lucide-react";
import AsynSchoolAutoComplete from "@/components/event/school-autocomplete";
import { useSchoolStore } from "@/stores";
import { SchoolData } from "@/@type";
import { Autocomplete, Button, TextField } from "@mui/material";
import clsx from "clsx";
import dayjs from "dayjs";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import {
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
export default function SolarCellForm() {
  const masterStore = useSchoolStore();

  const [formData, setFormData] = useState<Partial<SchoolData>>({});

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
    control,
  } = useForm<Partial<SchoolData>>({
    defaultValues: {
      statusArrObject: [{ status: "", date: "" }],
      activityArrObject: [{ activity: "", date: "" }],
    },
  });

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onSubmit: SubmitHandler<Partial<SchoolData>> = (data) => {
    console.log(data);
  };

  const statusFieldArr = useFieldArray({
    control,
    name: "statusArrObject",
  });
  const activityFieldArr = useFieldArray({
    control,
    name: "activityArrObject",
  });

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form Data:", formData);
  //   alert("ข้อมูลถูกบันทึกแล้ว");
  // };

  const handleChangeSchool = (d: SchoolData) => {
    if (d) {
      if (d?.statusArr) {
        const status = JSON.parse(d.statusArr) as {
          status: string;
          date: string;
        }[];
        status.map((d, i) => {
          setValue(`statusArrObject.${i}.status`, d.status);
          setValue(`statusArrObject.${i}.date`, d.date);
        });
      }

      if (d?.activityArr) {
        const status = JSON.parse(d.activityArr) as {
          activity: string;
          date: string;
        }[];
        status.map((d, i) => {
          setValue(`activityArrObject.${i}.activity`, d.activity);
          setValue(`activityArrObject.${i}.date`, d.date);
        });
      }

      Object.keys(d).forEach((k) => {
        const key: keyof SchoolData = k as keyof SchoolData;
        setValue(key, d[key]);
      });
    } else {
      reset();
    }
  };

  const watchedValues = watch([
    "ความเข้าใจในโมเดล ESCO (10%)",
    "การตัดสินใจและอำนาจภายใน (10%)",
    "ระดับความร่วมมือของโรงเรียน (10%)",
    "ความพร้อมในการให้ข้อมูล (10%)",
    "การค้างค่าไฟฟ้า (10%)",
    "พื้นที่ติดตั้งที่มีอยู่ (10%)",
    "สภาพวัสดุมุงหลังคา (10%)",
    "สภาพโครงสร้าง (10%)",
    "จุดเชื่อมต่อและการเดินสายไฟ (10%)",
  ]);

  useEffect(() => {
    let score = 0;

    watchedValues.forEach((v) => {
      if (v) score += v * 2;
    });

    // ✅ ป้องกันลูป: ถ้าคะแนนไม่เปลี่ยน → ไม่ต้อง setValue ใหม่
    const currentScore = watch("รวมคะแนน");
    if (currentScore !== score) {
      setValue("รวมคะแนน", score);
    }
  }, [watchedValues, setValue]);
  const inputClasses =
    "w-full bg-white text-black placeholder:text-gray-400  px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base";
  const labelClasses =
    "block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2";
  const sectionClasses =
    "bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100";

  return (
    <div className="pt-2 min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-8">
  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>ชื่อโรงเรียน</label>
                  <ScoolAutoComplete
                    masterData={masterStore.masterData}
                    handleChangeSchool={handleChangeSchool}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ตรวจสอบสถานที่</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ตรวจสอบสถานที่"
                    {...register("ตรวจสอบสถานที่")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>ที่อยู่</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ที่อยู่"
                    {...register("ที่อยู่")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ชื่อตำบล</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ชื่อตำบล"
                    {...register("ชื่อตำบล")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ชื่ออำเภอ</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="อำเภอ"
                    {...register("ชื่ออำเภอ")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ชื่อจังหวัด</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="จังหวัด"
                    {...register("ชื่อจังหวัด")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="รหัสไปรษณีย์"
                    maxLength={5}
                    {...register("รหัสไปรษณีย์")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ภาค</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ภาค"
                    {...register("ภาค")}
                  />
                </div>

                <div>
                  <label className={labelClasses}>จำนวนนักเรียน</label>
                  <input
                    type="number"
                    className={inputClasses}
                    placeholder="จำนวนนักเรียน"
                    {...register("จำนวนนักเรียน")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className={labelClasses}>สังกัด</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="สังกัด"
                    {...register("สังกัด")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>เขต</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="เขตการไฟฟ้าส่วนภูมิภาค"
                    {...register("เขต")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>อัตรา</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="อัตรา"
                    {...register("อัตรา")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>CA</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="CA"
                    {...register("CA")}
                  />
                </div>

                <div>
                  <label className={labelClasses}>KW_PK</label>
                  <input
                    type="number"
                    className={inputClasses}
                    placeholder="กำลังไฟฟ้า (KW)"
                    step="0.1"
                    {...register("KW_PK")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ค่าฟ้าเฉลี่ย/เดือน</label>
                  <input
                    type="number"
                    className={inputClasses}
                    placeholder="บาท/เดือน"
                    step="0.01"
                    {...register("ค่าฟ้าเฉลี่ย/เดือน")}
                  />
                </div>
              </div>
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
                    {...register("ชื่อผู้ประสานงานโรงเรียน")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>ตำแหน่ง</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="ตำแหน่ง"
                    {...register("ตำแหน่ง")}
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
                    {...register("เบอร์ติดต่อผู้ประสานงาน")}
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
                    {...register("ชื่อผู้อำนวยการโรงเรียน")}
                  />
                </div>
                <div>
                  <label className={labelClasses}>เบอร์ติดต่อ ผอ.</label>
                  <input
                    type="tel"
                    className={inputClasses}
                    placeholder="เบอร์โทรศัพท์ ผอ."
                    {...register("เบอร์ติดต่อ ผอ.")}
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
                  {...register("E-mail")}
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
          <div className={sectionClasses}>
            <div className="flex items-center mb-4 sm:mb-6">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                สถานะและกิจกรรม
              </h2>
            </div>

            <div>
              <label className={labelClasses}>การดำเนินงาน</label>
              <textarea
                className={`${inputClasses} h-24 resize-none`}
                placeholder="การดำเนินงาน"
                {...register("การดำเนินงาน")}
              />
            </div>
            <div className=" gap-2 mt-4 flex relative items-end">
              <div className="w-full space-y-2">
                <label className={labelClasses}>Status</label>
                {statusFieldArr.fields.map(
                  (data: { status: string; date: string }, index: number) => {
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
                        <input
                          type="date"
                          className={inputClasses}
                          placeholder="วันที่"
                          {...register(`statusArrObject.${index}.date`)}
                        />
                      </div>
                    );
                  }
                )}
              </div>
              <div className="pb-1">
                <Button
                  className="h-fit"
                  onClick={() =>
                    statusFieldArr.append({ status: "", date: "" })
                  }
                  variant="contained"
                >
                  {" "}
                  <X className="rotate-45" />{" "}
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4 relative items-end">
              <div className="w-full space-y-2">
                <label className={labelClasses}>Activity</label>
                {(watch().activityArrObject || []).map(
                  (data: { activity: string; date: string }, index: number) => {
                    return (
                      <div key={index} className="flex gap-2 ">
                        <select
                          className={inputClasses}
                          {...register(`activityArrObject.${index}.activity`)}
                        >
                          <option value="">เลือกสถานะ</option>
                          <option value="นำเสนอโครงการ">นำเสนอโครงการ</option>
                          <option value="ตอบรับเข้าร่วมโครงการ">
                            ตอบรับเข้าร่วมโครงการ
                          </option>
                          <option value="สำรวจ ออกแบบ และประมาณการ">
                            สำรวจ ออกแบบ และประมาณการ
                          </option>
                          <option value="ประเมินโครงการ พร้อมจัดทำข้อเสนอ">
                            ประเมินโครงการ พร้อมจัดทำข้อเสนอ
                          </option>
                          <option value="นำเสนอข้อเสนอโครงการ">
                            นำเสนอข้อเสนอโครงการ
                          </option>
                          <option value="ลงนามสัญญาให้บริการ">
                            ลงนามสัญญาให้บริการ
                          </option>
                        </select>
                        <input
                          type="date"
                          className={inputClasses}
                          placeholder="วันที่"
                          {...register(`activityArrObject.${index}.date`)}
                        />
                      </div>
                    );
                  }
                )}
              </div>
              <div className="pb-1">
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
          </div>

          <div className={sectionClasses}>
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
                    {...register(`ความเข้าใจในโมเดล ESCO (10%)`)}
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
                    {...register(`ระดับความร่วมมือของโรงเรียน (10%)`)}
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
                    {...register(`การตัดสินใจและอำนาจภายใน (10%)`)}
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
                    {...register(`ความพร้อมในการให้ข้อมูล (10%)`)}
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
                    {...register(`การค้างค่าไฟฟ้า (10%)`)}
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
                    {...register(`พื้นที่ติดตั้งที่มีอยู่ (10%)`)}
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
                    {...register(`สภาพวัสดุมุงหลังคา (10%)`)}
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
                    {...register(`สภาพโครงสร้าง (10%)`)}
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
                    {...register(`จุดเชื่อมต่อและการเดินสายไฟ (10%)`)}
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
                  <label className={labelClasses}>สภาพโครงสร้าง (10%)</label>
                  <select
                    className={inputClasses}
                    {...register(`สภาพโครงสร้าง (10%)`)}
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
                  {...register(`รวมคะแนน`)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className={labelClasses}>เลขที่</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="เลขที่เอกสาร"
                  {...register("เลขที่")}
                />
              </div>

              <div>
                <label className={labelClasses}>วันที่</label>
                <input
                  type="date"
                  className={inputClasses}
                  {...register("วันที่")}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div>
                <label className={labelClasses}>เลขที่ ศธ.</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="เลขที่เอกสาร ศธ."
                  {...register("เลขที่ ศธ.")}
                />
              </div>
              <div>
                <label className={labelClasses}>วันที่ตอบกลับ</label>
                <input
                  type="date"
                  className={inputClasses}
                  {...register("วันที่ตอบกลับ")}
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
                    className={`${inputClasses} h-24 resize-none`}
                    placeholder="รายละเอียดการจำลอง"
                    {...register("Simulation")}
                  />
                </div>
                {/* <div>
                  <label className={labelClasses}>ข้อเสนอโครงการ</label>
                  <textarea
                    name="projectProposal"
                    value={formData["ข้อเสนอโครงการ"] || ""}
                    onChange={handleInputChange}
                    className={`${inputClasses} h-24 resize-none`}
                    placeholder="รายละเอียดข้อเสนอโครงการ"
                  />
                </div> */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className={labelClasses}>Latitude</label>
                <input
                  type="number"
                  className={inputClasses}
                  placeholder="ละติจูด"
                  step="0.000001"
                  {...register("Latitude")}
                />
              </div>
              <div>
                <label className={labelClasses}>Longitude</label>
                <input
                  type="number"
                  className={inputClasses}
                  placeholder="ลองจิจูด"
                  step="0.000001"
                  {...register("Longitude")}
                />
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

          {/* ปุ่มบันทึก */}
          <div className="flex justify-center pt-6 sm:pt-8">
            <button
              type="submit"
              className="flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              <Save className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const ScoolAutoComplete = (props: {
  masterData: SchoolData[];
  handleChangeSchool: (d: SchoolData) => void;
}) => {
  const { masterData } = props;
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
    if (inputValue !== "") {
      return masterData
        .filter((d) => d?.["ชื่อโรงเรียน"].includes(inputValue))
        .splice(0, 49);
    }
    return masterData.splice(0, 21);
  }, [inputValue]);
  // const optionScool = schoolQuery.data?.map((d) => {
  //   return d;
  // });
  return (
    <Autocomplete
      freeSolo
      // sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={(event, value) => {
        setInputValue(value);
      }}
      isOptionEqualToValue={(option, value) => {
        return option?.["ชื่อโรงเรียน"] === value?.["ชื่อโรงเรียน"];
      }}
      onChange={(event: any, newValue) => {
        props.handleChangeSchool(newValue as SchoolData);
      }}
      getOptionKey={(option) =>
        typeof option === "object" && option !== null && "id" in option
          ? (option as SchoolData).id
          : String(option)
      }
      getOptionLabel={(option) =>
        typeof option === "object" &&
        option !== null &&
        "ชื่อโรงเรียน" in option
          ? (option as SchoolData)["ชื่อโรงเรียน"]
          : String(option)
      }
      options={optionScool ?? []}
      // loading={schoolQuery.isFetching}
      renderInput={(params) => (
        <TextField
          {...params}
          // label="ชื่อสถานศึกษา"
          placeholder="ชื่อสถานศึกษา"
          variant="standard"
          InputLabelProps={{ shrink: true }}
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
