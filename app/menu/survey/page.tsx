"use client";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ScoolAutoComplete } from "../form/page";
import { useSchoolStore } from "@/stores";
import { SchoolData } from "@/@type";
import { inputClasses, labelClasses, sectionClasses } from "@/utils/style";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import { Details } from "@mui/icons-material";

type FormData = {
  // Section 0
  schoolName: string;
  location: string;
  schoolLocation: string;
  gps: string;
  capacity: string;
  coordinator: string;
  surveyor: string;
  // Section 1
  billCase1: string;
  billCase2Meter1: string;
  billCase2Meter2: string;
  // Section 2
  gridProviderMEA: boolean;
  gridProviderPEA: boolean;
  voltageLevel: string;
  transformerCount: number;
  transformerSize1: string;
  transformerSize2: string;
  // etc...
};

export default function SurveyForm() {
  const masterStore = useSchoolStore();
  const { handleSubmit, control, register, watch, setValue } =
    useForm<FormData>({
      defaultValues: {
        // initialize defaults if you like
        gridProviderMEA: false,
        gridProviderPEA: false,
        voltageLevel: "",
      },
    });
  console.log(watch());
  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
  };
  const handleChangeSchool = (data: SchoolData[] | undefined) => {
    console.log("data", data?.[0]);
    setValue("schoolName", data?.[0]["ชื่อโรงเรียน"]!);
  };
  return (
    <Container maxWidth="lg" className="py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 0: รายงานการสำรวจและตรวจสอบเบื้องต้น */}

        <div className={` ${clsx(sectionClasses)}`}>
          <div className="flex items-center mb-4 sm:mb-6">
            <Details className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2 sm:mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              รายงานการสำรวจ และตรวจสอบเบื้องต้น
            </h2>
          </div>

          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              ข้อมูลผู้ประสานงานโรงเรียน
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className={labelClasses}>
                  ชื่อโรงเรียน (School Name)
                </label>
                <Controller
                  name="schoolName"
                  control={control}
                  render={({ field }) => (
                    <ScoolAutoComplete
                      masterDataKey={masterStore.masterDataKey}
                      handleChangeSchool={handleChangeSchool}
                    />
                  )}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  สถานที่ตั้ง (School Location)
                </label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="สถานที่ตั้ง"
                  {...register("location")}
                />
              </div>
              <div>
                <label className={labelClasses}>พิกัด (GPS Coordinates)</label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="เบอร์โทรศัพท์"
                  {...register("เบอร์ติดต่อผู้ประสานงาน")}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  กำลังการผลิตติดตั้ง (kWp.)
                </label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="เบอร์โทรศัพท์"
                  {...register("เบอร์ติดต่อผู้ประสานงาน")}
                />
              </div>
              <div>
                <label className={labelClasses}>ผู้ติดต่อ (Coordinator)</label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="เบอร์โทรศัพท์"
                  {...register("เบอร์ติดต่อผู้ประสานงาน")}
                />
              </div>
              <div>
                <label className={labelClasses}>เบอร์โทร</label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="เบอร์โทรศัพท์"
                  {...register("เบอร์ติดต่อผู้ประสานงาน")}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  ผู้สำรวจ/ผู้บันทึกการสำรวจ (Surveyor)
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
        </div>

        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            1. พฤติกรรมของผู้ใช้ไฟฟ้า
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>
                กรณีมี 1 มิเตอร์ (บาท/เดือน)
              </label>
              <input
                type="text"
                className={inputClasses}
                {...register("billCase1")}
              />
            </div>
            <div>
              <label className={labelClasses}>มิเตอร์ที่ 1 (บาท/เดือน)</label>
              <input
                type="text"
                className={inputClasses}
                {...register("billCase2Meter1")}
              />
            </div>
            <div>
              <label className={labelClasses}>มิเตอร์ที่ 2 (บาท/เดือน)</label>
              <input
                type="text"
                className={inputClasses}
                {...register("billCase2Meter2")}
              />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            2. ลักษณะของผู้ใช้ไฟฟ้า
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>ผู้ให้บริการระบบไฟฟ้า</label>
              <Controller
                name="gridProviders"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1">
                    {["MEA", "PEA"].map((prov) => (
                      <label key={prov} className="flex items-center">
                        <input
                          type="checkbox"
                          value={prov}
                          // checked={field.value?.includes(prov)}
                          // onChange={(e) => {
                          //   const v = field.value?.includes(prov)
                          //     ? field.value.filter((x) => x !== prov)
                          //     : [...field.value, prov];
                          //   field.onChange(v);
                          // }}
                        />
                        <span className="ml-2">{prov}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
            <div>
              <label className={labelClasses}>ระดับแรงดันไฟฟ้า</label>
              <select className={inputClasses} {...register("voltageLevel")}>
                {["230V", "400V", "22kV", "24kV", "33kV", "69kV", "115kV"].map(
                  (v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className={labelClasses}>จำนวนหม้อแปลง</label>
              <input
                type="number"
                className={inputClasses}
                {...register("transformerCount", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            3. ข้อมูลโครงสร้าง
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>อาคาร</label>
              <input
                type="text"
                className={inputClasses}
                {...register("structureBuilding")}
              />
            </div>
            {/* Roof Ages */}
            {["RoofRomanAge", "RoofCPACAge", "RoofMetalAge", "Other"].map(
              (key) => (
                <div key={key}>
                  <label className={labelClasses}>{key} (ปี)</label>
                  <input
                    type="text"
                    className={inputClasses}
                    {...register(`roofAges.${key}` as const)}
                  />
                </div>
              )
            )}
            <div>
              <label className={labelClasses}>ขนาดพื้นที่ (ตร.ม.)</label>
              <input
                type="text"
                className={inputClasses}
                {...register("structureArea")}
              />
            </div>
            <div>
              <label className={labelClasses}>ความชัน (°)</label>
              <select className={inputClasses} {...register("roofAngle")}>
                {[0, 10, 15, 20, 25, 30, 35, 40, 45].map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}°
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-full">
              <label className={labelClasses}>รูปทรงหลังคา</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Hip", "Gable", "Flat", "Shed"].map((shape) => (
                  <label key={shape} className="flex items-center">
                    <Controller
                      name="roofShapes"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          value={shape}
                          // checked={field.value.includes(shape)}
                          // onChange={(e) => {
                          //   const v = e.target.checked
                          //     ? [...field.value, shape]
                          //     : field.value.filter((x) => x !== shape);
                          //   field.onChange(v);
                          // }}
                        />
                      )}
                    />
                    <span className="ml-2">{shape}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            4. ข้อมูลเพิ่มเติมที่ได้รับ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "RoofPlan",
              "BuildingPlan",
              "ElecPlan",
              "MonthlyBill",
              "LoadProfile",
            ].map((doc) => (
              <label key={doc} className="flex items-center">
                <Controller
                  name={`docsReceived.${doc}` as const}
                  control={control}
                  render={({ field }) => (
                    <input type="checkbox" {...field} checked={field.value} />
                  )}
                />
                <span className="ml-2">{doc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            5. บันทึก
          </h3>
          <textarea className={`${inputClasses} h-32`} {...register("note")} />
        </div>

        {/* Section 6 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            6. รูปถ่าย
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>6.1 ตู้ไฟ Zero export</label>
              <input
                type="file"
                multiple
                className="mt-1"
                {...register("zeroExportImages")}
              />
            </div>
            <div>
              <label className={labelClasses}>6.2 ตู้ไฟ Solar cell</label>
              <input
                type="file"
                multiple
                className="mt-1"
                {...register("cellImages")}
              />
            </div>
          </div>
        </div>
        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            บันทึกข้อมูล
          </Button>
        </Box>
      </form>
    </Container>
  );
}
