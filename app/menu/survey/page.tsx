"use client";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
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
import {
  SchoolData,
  SurveyBuilding,
  surveyCabinet,
  surveySolarInstall,
  surveyTransformer,
  surveyUserBehavior,
} from "@/@type";
import { inputClasses, labelClasses, sectionClasses } from "@/utils/style";
import clsx from "clsx";
import { CheckCircle, Delete, Edit, X } from "lucide-react";
import { Details } from "@mui/icons-material";
import StructureModal, { StructureFormValues } from "./dialog";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { usePreviews, usePreviewsArr, usePreviewsSimple } from "./preview";
import { createSurvey } from "@/lib/survay.actions";
import { ID } from "appwrite";
import { createClientAppwrite } from "@/utils/appwrite_client";
import pMap from "p-map";
import { formatUrlFile } from "@/utils/fn";
import {
  formatBottomViewImage,
  formatBuilding,
  formatCabinet,
  formatSolarCellInstall,
  formatTopviewImage,
  formatTransformer,
  formatUserBehavior,
} from "./fn";

export type FormData = {
  // Section 0
  schoolName: string;
  address: string;
  schoolLocation: string;
  kwp: number;
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
  // Section 3
  building: StructureFormValues[];
  docsReceived: {
    roofplan: boolean;
    buildingplan: boolean;
    elecplan: boolean;
    monthlybill: boolean;
    loadprofile: boolean;
  };
  remark: string;
  voltageLevel: boolean[];
  transformerCount: number;

  zeroExportCabinet: {
    name: string;
    photos?: File;
  }[];
  solarCellCabinet: {
    name: string;
    photos?: File;
  }[];
  solarCellBuiling: {
    name: string;
    photos: File[];
  }[];
  topviewImage?: File[];
  bottomViewImage?: File[];

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

  const [isOpen, setIsOpen] = useState<{
    data?: StructureFormValues | undefined;
    index?: number | undefined;
    open: boolean;
  }>({
    data: undefined,
    index: undefined,
    open: false,
  });

  const { handleSubmit, control, reset,register, watch, setValue, getValues } =
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
        kwp: 0,
        transformerCount: 0,
        gridProvider: "",
        // gridProviderMEA: false,
        // gridProviderPEA: false,
        voltageLevel: [],
        zeroExportCabinet: [{ name: "", photos: undefined }],
        solarCellCabinet: [{ name: "", photos: undefined }],
        solarCellBuiling: [{ name: "", photos: [] }],
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

  const zeroExportCabinetArrForm = useFieldArray({
    name: "zeroExportCabinet",
    control,
  });
  const solarCellCabinetArrForm = useFieldArray({
    name: "solarCellCabinet",
    control,
  });
  const solarCellBuilingtArrForm = useFieldArray({
    name: "solarCellBuiling",
    control,
  });

  // ② useMemo ดูที่ zeroList (reference ใหม่ทุกครั้งที่ photos เปลี่ยน)
  const zeroPreviews = usePreviews(control, "zeroExportCabinet");
  const solarPreviews = usePreviews(control, "solarCellCabinet");
  const solarCellBuilingPreviews = usePreviewsArr(control, "solarCellBuiling");
  const topPreviews = usePreviewsSimple(control, "topviewImage");
  const bottomPreviews = usePreviewsSimple(control, "bottomViewImage");
  // ③ ล้าง URL เก่า
  useEffect(() => {
    return () => {
      zeroPreviews.forEach((u) => u && URL.revokeObjectURL(u));
      solarPreviews.forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [zeroPreviews, solarPreviews]);

  const [previews, setPreviews] = useState<string[]>([]);

  // Generate previews whenever the FileList changes

  // console.log(watch());
  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    const transformer = formatTransformer(data.transformer);
    const cabinets = await formatCabinet({
      solarCellCabinet: data.solarCellCabinet,
      zeroExportCabinet: data.zeroExportCabinet,
    });
    const userBehavior = formatUserBehavior(data.userBehavior);
    const building = formatBuilding(data.building);

    const solarCellBuiling = await formatSolarCellInstall({
      solarCellBuiling: data.solarCellBuiling,
    });

    const topviewImage = await formatTopviewImage(data.topviewImage);
    const bottomViewImage = await formatBottomViewImage(data.bottomViewImage);

    const formatData = {
      school_name: data.schoolName,
      location: data.address,
      gps: data.gps,
      kwp: data.kwp,
      contact_name: data.contactName,
      contact_phone: data.contactPhone,
      surveyor: data.surveyor,
      roofplan: data.docsReceived.roofplan,
      buildingplan: data.docsReceived.buildingplan,
      elecplan: data.docsReceived.elecplan,
      monthlybill: data.docsReceived.monthlybill,
      loadprofile: data.docsReceived.loadprofile,
      remark: data.remark,
      voltageLevel: data.voltageLevel,
      transformerCount: data.transformerCount,
      topview_image: topviewImage,
      bottomview_image: bottomViewImage,
    };
    await createSurvey({
      data: formatData,
      transformer: transformer,
      cabinet: cabinets as Partial<surveyCabinet>[],
      install_solar:
        solarCellBuiling as unknown as Partial<surveySolarInstall>[],
      rooftop_image: topviewImage,
      bottom_view_image: bottomViewImage,
      userBehavior: userBehavior as unknown as Partial<surveyUserBehavior>[],
      building: building,
    });
    alert("บันทึกข้อมูลสำเร็จ");
    reset();
  };

  const handleChangeSchool = (data: SchoolData[] | undefined) => {
    setValue("schoolName", data?.[0]["ชื่อโรงเรียน"]!);
    setValue("address", data?.[0]["ที่อยู่"]!);
    setValue("gps", data?.[0]["Latitude"]! + "," + data?.[0]["Longitude"]!);
  };

  const onEditBuilding = (props: {
    data: StructureFormValues;
    index: number;
  }) => {
    setIsOpen({
      data: props.data,
      index: props.index,
      open: true,
    });
  };

  const onDeleteBuilding = (index: number) => {
    const building = _.cloneDeep(watch("building") || []);
    building.splice(index, 1);
    setValue("building", building);
  };
  return (
    <Container maxWidth="lg" className="py-8">
      <StructureModal
        isOpen={isOpen.open}
        onClose={() => {
          setIsOpen({ open: false });
        }}
        buildingData={isOpen.data}
        onSubmit={(data: StructureFormValues) => {
          if (isOpen.index !== undefined) {
            const building = watch("building") || [];
            building[isOpen.index] = data;
            setValue("building", building);
          } else {
            const building = watch("building") || [];
            building.push(data);
            setValue("building", building);
          }
        }}
      />

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
                  {...register("kwp", {
                    valueAsNumber: true,
                  })}
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
                        className={clsx(` whitespace-nowrap ` + labelClasses)}
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
                        className={clsx(` whitespace-nowrap ` + labelClasses)}
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
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              3. ข้อมูลโครงสร้าง
            </h3>
            <Button
              variant="contained"
              onClick={() =>
                setIsOpen({
                  open: true,
                })
              }
            >
              เพิ่มอาคาร
            </Button>
          </div>
          <div>
            {(watch("building") || []).map((building, index) => (
              <div
                className="grid grid-cols-1 sm:flex  gap-6 items-center mt-2"
                key={index}
              >
                <div className="flex-1   flex gap-4 sm:gap-12 ">
                  <p>อาคารที่ {index + 1}</p>
                  <p className="">ชื่ออาคาร : {building.buildingName}</p>
                </div>
                <div className="flex gap-2 w-full  sm:w-fit">
                  <Button
                    className="w-full"
                    color="error"
                    variant="contained"
                    onClick={() => onDeleteBuilding(index)}
                  >
                    <label className="flex items-center gap-2">
                      <Delete className="" />
                      ลบ
                    </label>
                  </Button>
                  <Button
                    className="w-full"
                    variant="contained"
                    color="primary"
                    onClick={() => onEditBuilding({ data: building, index })}
                  >
                    <label className="flex items-center gap-2">
                      <Edit className="" />
                      แก้ไข
                    </label>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            4. ข้อมูลเพิ่มเติมที่ได้รับ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "แบบโครงสร้างหลังคา", value: "roofplan" },
              { label: "แบบอาคาร", value: "buildingplan" },
              { label: "แบบไฟฟ้า", value: "elecplan" },
              { label: "ใบแจ้งหนี้ค่าไฟฟ้ารายเดือน", value: "monthlybill" },
              { label: "Load Profile / AMR", value: "loadprofile" },
            ].map((doc) => (
              <label key={doc.value} className="flex items-center">
                <Controller
                  name={`docsReceived.${doc.value}` as any}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value || false}
                    />
                  )}
                />
                <span className="ml-2">{doc.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            5. บันทึก
          </h3>
          <textarea
            className={`${inputClasses} h-32`}
            {...register("remark")}
          />
        </div>

        {/* Section 6 */}
        <div className={sectionClasses}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            6. รูปถ่าย (Pictures)
          </h3>
          <div className="space-y-4">
            <label className={labelClasses}>
              6.1 ตู้ไฟฟ้าที่จะติดตั้งระบบ Zero export
            </label>
            {zeroExportCabinetArrForm?.fields.map((field, idx) => (
              <div key={field.id} className="flex   gap-4 items-center">
                <input
                  placeholder="ตู้ ไฟฟ้า อาคาร"
                  {...register(`zeroExportCabinet.${idx}.name` as const)}
                  className="block w-1/3 h-fit border px-2 py-1"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file)
                      setValue(
                        `zeroExportCabinet.${idx}.photos` as const,
                        file,
                        { shouldDirty: true, shouldValidate: true }
                      );
                  }}
                />
                {
                  <>
                    {zeroPreviews[idx] !== "" &&
                    zeroPreviews[idx] !== undefined ? (
                      <img
                        src={zeroPreviews[idx]}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded"></div>
                    )}
                  </>
                }
                <div className="pb-1 flex gap-2 items-end">
                  {idx !== 0 ? (
                    <Button
                      onClick={() => zeroExportCabinetArrForm.remove(idx)}
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
                      zeroExportCabinetArrForm.append({
                        name: "",
                        photos: undefined,
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
            ))}

            <div>
              <label className={labelClasses}>
                6.2 ตู้ไฟฟ้าที่จะเชื่อมต่อระบบโซล่าเซลล์
              </label>
              {solarCellCabinetArrForm?.fields.map((field, idx) => (
                <div key={field.id} className="flex   gap-4 items-center">
                  <input
                    placeholder="ตู้ ไฟฟ้า อาคาร"
                    {...register(`solarCellCabinet.${idx}.name` as const)}
                    className="block w-1/3 h-fit border px-2 py-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        setValue(
                          `solarCellCabinet.${idx}.photos` as const,
                          file,
                          { shouldDirty: true, shouldValidate: true }
                        );
                    }}
                  />
                  {
                    <>
                      {solarPreviews[idx] !== "" &&
                      solarPreviews[idx] !== undefined ? (
                        <img
                          src={solarPreviews[idx]}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded"></div>
                      )}
                    </>
                  }
                  <div className="pb-1 flex gap-2 items-end">
                    {idx !== 0 ? (
                      <Button
                        onClick={() => solarCellCabinetArrForm.remove(idx)}
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
                        solarCellCabinetArrForm.append({
                          name: "",
                          photos: undefined,
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
              ))}
            </div>
            <div>
              <label className={labelClasses}>
                6.3 อาคารที่จะติดตั้งเเผงโซล่าเซลล์
              </label>
              {solarCellBuilingtArrForm.fields.map((field, i) => (
                <div key={field.id} className="border p-3 rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      {...register(`solarCellBuiling.${i}.name` as const)}
                      placeholder="ตู้ ไฟฟ้า อาคาร"
                      className="w-full border px-2 py-1"
                    />
                    <div className="pb-1 flex gap-2 items-end">
                      {i !== 0 ? (
                        <Button
                          onClick={() => solarCellBuilingtArrForm.remove(i)}
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
                          solarCellBuilingtArrForm.append({
                            name: "",
                            photos: [],
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

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      const old = watch(`solarCellBuiling.${i}.photos`) || [];
                      setValue(
                        `solarCellBuiling.${i}.photos` as const,
                        [...old, ...files] as any,
                        { shouldDirty: true, shouldValidate: true }
                      );
                    }}
                  />

                  {/* 4) แสดง preview หลายภาพ */}
                  <div className="flex flex-wrap gap-2">
                    {solarCellBuilingPreviews[i]?.map((src, j) => (
                      <div key={j} className="relative w-24 h-24">
                        <img
                          src={src}
                          alt={`preview ${j}`}
                          className="object-cover w-full h-full rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const old =
                              getValues(`solarCellBuiling.${i}.photos`) || [];
                            const next = old.filter((_, idx) => idx !== j);
                            setValue(
                              `solarCellBuiling.${i}.photos` as const,
                              next,
                              { shouldDirty: true }
                            );
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* 6.4 Top Images */}
              <div className="space-y-2">
                <h2 className="font-semibold">6.4 ภาพมุมสูง (โดยรวม)</h2>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    const old = getValues("topviewImage");
                    setValue("topviewImage", [...(old || []), ...files], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {topPreviews.map((src, j) => (
                    <div key={j} className="relative w-24 h-24">
                      <img
                        src={src}
                        alt={`topviewImage ${j}`}
                        className="object-cover w-full h-full rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const old = getValues("topviewImage");
                          const next = old?.filter((_, idx) => idx !== j);
                          setValue("topviewImage", next, {
                            shouldDirty: true,
                          });
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6.5 Bottom‐view Images */}
              <div className="space-y-2">
                <h2 className="font-semibold">6.5 ภาพมุมต่ำ (โดยรวม)</h2>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    const old = getValues("bottomViewImage");
                    setValue("bottomViewImage", [...(old || []), ...files], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {bottomPreviews.map((src, j) => (
                    <div key={j} className="relative w-24 h-24">
                      <img
                        src={src}
                        alt={`bottomview ${j}`}
                        className="object-cover w-full h-full rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const old = getValues("bottomViewImage");
                          const next = old?.filter((_, idx) => idx !== j);
                          setValue("bottomViewImage", next, {
                            shouldDirty: true,
                          });
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
