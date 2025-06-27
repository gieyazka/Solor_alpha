"use client";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ScoolAutoComplete } from "../form/page";
import { useSchoolStore } from "@/stores";
import { SchoolData } from "@/@type";
import { inputClasses, labelClasses, sectionClasses } from "@/utils/style";
import clsx from "clsx";
import { CheckCircle, X } from "lucide-react";
import { Details } from "@mui/icons-material";

type FormData = {
  // Section 0
  schoolName: string;
  address: string;
  schoolLocation: string;
  kwp: string;
  contactName: string;
  contactPhone: string;
  surveyor: string;
  userBehavior: { meter: string; building: string; amount: string }[];
  transformerAmount: number;
  transformer: { location: string; meter: string }[];
  gps: string;
  capacity: string;
  coordinator: string;
  // Section 1
  billCase1: string;
  billCase2Meter1: string;
  billCase2Meter2: string;
  // Section 2
  // gridProviderMEA: boolean;
  gridProvider: string;
  // gridProviderPEA: boolean;
  voltageLevel: boolean[];
  transformerCount: number;
  transformerSize1: string;
  transformerSize2: string;
  // etc...
};
const voltageoptions = [
  { label: "230V (1 Phase)", value: "230V (1 Phase)" },
  { label: "400V (3 Phase)", value: "400V (3 Phase)" },
  { label: "22KV", value: "22KV" },
  { label: "24KV", value: "24KV" },
  { label: "33KV", value: "33KV" },
  { label: "69KV", value: "69KV" },
  { label: "115KV", value: "115KV" },
];
export default function SurveyForm() {
  const masterStore = useSchoolStore();
  const { handleSubmit, control, register, watch, setValue } =
    useForm<FormData>({
      defaultValues: {
        // initialize defaults if you like
        userBehavior: [
          {
            meter: "",
            building: "",
            amount: "",
          },
        ],
        transformer: [
          {
            location: "",
            meter: "",
          },
        ],
        gridProvider: "",
        // gridProviderMEA: false,
        // gridProviderPEA: false,
        voltageLevel: [],
      },
    });

  const userBehaviorArrForm = useFieldArray({
    control,
    name: "userBehavior",
  });
  const transformerArrForm = useFieldArray({
    control,
    name: "transformer",
  });

  // console.log(watch());
  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
  };
  const handleChangeSchool = (data: SchoolData[] | undefined) => {
    setValue("schoolName", data?.[0]["ชื่อโรงเรียน"]!);
    setValue("address", data?.[0]["ที่อยู่"]!);
    setValue("gps", data?.[0]["Latitude"]! + "," + data?.[0]["Longitude"]!);
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
                  {...register("address")}
                />
              </div>
              <div>
                <label className={labelClasses}>พิกัด (GPS Coordinates)</label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="พิกัด (GPS Coordinates)"
                  {...register("gps")}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  กำลังการผลิตติดตั้ง (kWp.)
                </label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="กำลังการผลิตติดตั้ง (kWp.)"
                  {...register("kwp")}
                />
              </div>
              <div>
                <label className={labelClasses}>ผู้ติดต่อ (Coordinator)</label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="ผู้ติดต่อ (Coordinator)"
                  {...register("contactName")}
                />
              </div>
              <div>
                <label className={labelClasses}>เบอร์โทรผู้ติดต่อ</label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="เบอร์โทรผู้ติดต่อ"
                  {...register("contactPhone")}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  ผู้สำรวจ/ผู้บันทึกการสำรวจ (Surveyor)
                </label>
                <input
                  type="tel"
                  className={inputClasses}
                  placeholder="ผู้สำรวจ/ผู้บันทึกการสำรวจ (Surveyor)"
                  {...register("surveyor")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            1. พฤติกรรมของผู้ใช้ไฟฟ้า
          </h3>
          {userBehaviorArrForm.fields.map((field, index) => {
            const i = index + 1;
            return (
              <div key={field.id} className="">
                <div className="my-2">
                  <label className={clsx(`!my-2 !bg-red-500` + labelClasses)}>
                    มิเตอร์ที่ {index + 1}
                  </label>
                </div>
                <div className="grid sm:flex grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 items-center">
                  <select
                    className={inputClasses}
                    {...register(`userBehavior.${index}.meter`)}
                  >
                    <option value="">เลือก Meter</option>
                    {["TOD", "TOU"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="อาคาร"
                    {...register(`userBehavior.${index}.building`)}
                  />
                  <div className="flex w-full gap-2 items-center">
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="ค่าไฟฟ้าเฉลี่ย/เดือน"
                      {...register(`userBehavior.${index}.amount`)}
                    />
                    <p className="whitespace-nowrap">บาท/เดือน</p>
                  </div>
                  <div className="pb-1 flex gap-2 items-end">
                    {index !== 0 ? (
                      <Button
                        onClick={() => userBehaviorArrForm.remove(index)}
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
                        userBehaviorArrForm.append({
                          meter: "",
                          amount: "",
                          building: "",
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
            );
          })}
        </div>

        {/* Section 2 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            2. ลักษณะของผู้ใช้ไฟฟ้า
          </h3>
          <div className="grid grid-cols-1  gap-4">
            {/* <label className={labelClasses}>ผู้ให้บริการระบบไฟฟ้า</label> */}
            <Controller
              name="gridProvider"
              control={control}
              render={({ field }) => {
                return (
                  <FormControl
                    sx={{
                      flexDirection: "column",
                      // alignItems: "center",
                      // justifyContent: "",
                      gap: 2,
                    }}
                  >
                    <label className={labelClasses} id="gridProvider-label">
                      ผู้ให้บริการระบบไฟฟ้า
                    </label>
                    <RadioGroup
                      // className="flex-1 flex justify-center"
                      row
                      aria-labelledby="gridProvider-label"
                      value={field.value}
                      onChange={(_, value) => field.onChange(value)}
                    >
                      <FormControlLabel
                        value="MEA"
                        control={<Radio />}
                        label="MEA: การไฟฟ้านครหลวง"
                      />
                      <FormControlLabel
                        value="PEA"
                        control={<Radio />}
                        label="PEA: การไฟฟ้าส่วนภูมิภาค"
                      />
                    </RadioGroup>
                  </FormControl>
                );
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
            <div>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <label className="text-base my-2">
                  ระดับแรงดันไฟฟ้าของลูกค้า (Connected Voltage Level)
                </label>
                <FormGroup row>
                  <Controller
                    name="voltageLevel"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { value, onChange, name, ref } }) =>
                      // @ts-ignore
                      voltageoptions.map((opt) => (
                        <FormControlLabel
                          key={opt.value}
                          label={opt.label}
                          control={
                            <Checkbox
                              // 1) Always pass a boolean to `checked`
                              checked={value.includes(
                                opt.value as unknown as boolean
                              )}
                              // 2) Wire onChange to MUI’s two-arg signature, then update the array
                              onChange={(
                                _event: React.ChangeEvent<HTMLInputElement>,
                                checked: boolean
                              ) => {
                                const next = checked
                                  ? [...value, opt.value]
                                  : value.filter(
                                      (v) => v !== (opt.value as any)
                                    );
                                onChange(next);
                              }}
                              // 3) Pass name & ref so RHF can track this input
                              name={name}
                              inputRef={ref}
                            />
                          }
                        />
                      ))
                    }
                  />
                </FormGroup>
              </FormControl>
            </div>
            <div>
              <label className={labelClasses}>จำนวนหม้อแปลง</label>
              <input
                type="number"
                className={inputClasses}
                {...register("transformerCount", { valueAsNumber: true })}
              />
            </div>
            {transformerArrForm.fields.map((field, index) => {
              const i = index + 1;
              return (
                <div key={field.id} className="">
                  <div className="gap-2 flex w-full  ">
                    <div className=" gap-2 flex-1">
                      <label
                        className={clsx(
                          ` whitespace-nowrap ` + labelClasses
                        )}
                      >
                        พิกัดหม้อแปลงที่ {index + 1}
                      </label>
                      <input
                        type="text"
                        className={inputClasses}
                        placeholder="พิกัดหม้อแปลง"
                        {...register(`transformer.${index}.location`)}
                      />
                    </div>
                    <div className=" gap-2 flex-1">
                      <label
                        className={clsx(
                          ` whitespace-nowrap ` + labelClasses
                        )}
                      >
                        kva/มิเตอร์ {index + 1}
                      </label>
                      <input
                        type="text"
                        className={inputClasses}
                        placeholder="kva/มิเตอร์"
                        {...register(`transformer.${index}.meter`)}
                      />
                    </div>
                    <div className="grid sm:flex grid-cols-1  gap-4 items-end">
                      <div className="pb-1 flex gap-2 items-end">
                        {index !== 0 ? (
                          <Button
                            onClick={() => transformerArrForm.remove(index)}
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
                            transformerArrForm.append({
                              meter: "",
                              location: "",
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
                </div>
              );
            })}
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
