import { inputClasses, labelClasses } from "@/utils/style";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

type RoofTypeKey =
  | "roman"
  | "cpac"
  | "prestige"
  | "slab"
  | "metalSheet"
  | "other";

export interface StructureFormValues {
  // 3.1
  buildingName: string;

  roofTypes: Record<
    RoofTypeKey,
    { checked: boolean; age: number; otherLabel?: string }
  >;
  // 3.2
  area: number;
  slopeDegree: number[];
  // 3.3
  shapes: Record<string, boolean>;
  // 3.4
  metalProfiles: Record<string, boolean>;
  // 3.5
  pitch: number;
  // 3.6
  structure: {
    wood: { checked: boolean; type: string[]; age: number };
    steel: { checked: boolean; type: string[]; age: number };
  };
  // 3.7–3.12
  span1: number;
  span2: number;
  baySpacing: number;
  lightOpening: number;
  widthEave1: number;
  widthEave2: number;
  // 3.13–3.16
  lightningProtector: boolean;
  ladder: boolean;
  jackRoof: boolean;
  turbine: boolean;
  // 3.17
  otherNotes: string;
}

const ROOF_LABELS: Record<RoofTypeKey, string> = {
  roman: "กระเบื้องลอนคู่ (Roman Tiles)",
  cpac: "กระเบื้องเซรามิคแบบลอนต่ำ (CPAC)",
  prestige: "กระเบื้องเรียบ (Prestige)",
  slab: "สแลบคอนกรีต (Slab)",
  metalSheet: "เมทัลชีท (Metal Sheet)",
  other: "อื่นๆ",
};

const SLOPE_OPTIONS = [0, 10, 15, 20, 25, 30, 35, 40, 45];
const WOOD = ["ไม้เต็ง", "ไม้แดง", "ไม่เบญจพรรณ", "ไม่ตะแบก"];
const STEEL = ["รูปพรรณ", "กัลวาไนซ์", "เหล็กรางซี"];
const SHAPES = [
  "OPEN GABLE",
  "BOX GABLE",
  "HIP",
  "FLAT",
  "DUTCH GABLE",
  "SALTBOX",
  "DORMER",
  "SHED",
  "M SHAPED",
  "PYRAMID HIP",
  "CLERESTORY",
];
const METAL_PROFILES = [
  "CR-700KL",
  "CR-750BL",
  "CR-750W",
  "CR-600W",
  "CR-650BL",
];

const defaultValues: StructureFormValues = {
  buildingName: "",

  roofTypes: {
    roman: { checked: false, age: 0 },
    cpac: { checked: false, age: 0 },
    prestige: { checked: false, age: 0 },
    slab: { checked: false, age: 0 },
    metalSheet: { checked: false, age: 0 },
    other: { checked: false, age: 0, otherLabel: "" },
  },
  area: 0,
  slopeDegree: [],
  shapes: SHAPES.reduce((acc, s) => ({ ...acc, [s]: false }), {} as any),
  metalProfiles: METAL_PROFILES.reduce(
    (acc, m) => ({ ...acc, [m]: false }),
    {} as any
  ),
  pitch: 0,
  structure: {
    wood: { checked: false, type: [], age: 0 },
    steel: { checked: false, type: [], age: 0 },
  },
  span1: 0,
  span2: 0,
  baySpacing: 0,
  lightOpening: 0,
  widthEave1: 0,
  widthEave2: 0,
  lightningProtector: false,
  ladder: false,
  jackRoof: false,
  turbine: false,
  otherNotes: "",
};

export default function StructureModal({
  isOpen,
  onClose,
  onSubmit,
  buildingData,
}: {
  buildingData: StructureFormValues | undefined;

  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<StructureFormValues>;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { register, handleSubmit, reset, watch, control, setValue } =
    useForm<StructureFormValues>({
      defaultValues,
    });
  const handleRequestClose = (
    event?: {},
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    setConfirmOpen(true);
  };
  const handleSubmitForm = (data: StructureFormValues) => {
    console.log("handleSubmit", data);
    onSubmit(data);
    onClose();
    reset(defaultValues);
  };

  // user ยืนยันจะปิดจริง
  const handleConfirmClose = () => {
    setConfirmOpen(false);
    reset(defaultValues);
    onClose(); // ปิด Dialog หลัก
  };

  // user ยกเลิก จะไม่ปิด Dialog หลัก
  const handleCancelClose = () => {
    setConfirmOpen(false);
  };
  // reset form when opened
  useEffect(() => {
    if (isOpen) reset(defaultValues);
  }, [isOpen, reset]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    if (buildingData) {
      reset(buildingData);
    } else {
      reset(defaultValues);
    }
  }, [buildingData, reset]);
  if (!isOpen) return null;
  const watchedRoof = watch("roofTypes");
  return (
    <div className="h-screen bg-black/50 flex items-center justify-center z-50">
      <Dialog open={confirmOpen} onClose={handleCancelClose}>
        <DialogTitle>ยืนยัน</DialogTitle>
        <DialogContent dividers>
          คุณต้องการทิ้งข้อมูลที่กรอกหรือไม่?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>ไม่ใช่</Button>
          <Button onClick={handleConfirmClose} variant="contained" autoFocus>
            ใช่ ปิดเลย
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isOpen}
        fullScreen={fullScreen}
        onClose={handleRequestClose}
        fullWidth
        maxWidth="lg"
      >
        <div className="bg-white rounded-lg w-fullmax-h-[90vh] overflow-y-auto shadow-lg">
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold">3. ข้อมูลโครงสร้าง</h2>
            <img
              src="/image/roof.png"
              alt="roof"
              className=" p-4 w-full h-auto"
            />

            <div>
              <label className={labelClasses}>ชื่ออาคาร</label>
              <input
                {...register(`buildingName`)}
                placeholder="ชื่ออาคาร"
                className={inputClasses}
              />
            </div>
            {/* 3.1 Roof Types */}
            <section className="space-y-2">
              <h3 className="font-medium">3.1 ประเภทหลังคาและอายุ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-3">
                {Object.entries(ROOF_LABELS).map(([k, label]) => {
                  const key = k as RoofTypeKey;
                  return (
                    <div
                      key={key}
                      className="flex w-full  items-center space-x-4"
                    >
                      <div className="flex items-center   w-full gap-4">
                        <input
                          type="checkbox"
                          {...register(`roofTypes.${key}.checked` as const)}
                          className="h-4 w-4"
                        />
                        <label className="whitespace-nowrap">{label}</label>
                        {key === "other" && watchedRoof.other.checked && (
                          <input
                            {...register("roofTypes.other.otherLabel")}
                            placeholder="ระบุอื่นๆ"
                            className="w-40 border rounded px-2 py-1"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-end  w-full space-x-2">
                        <input
                          type="number"
                          {...register(`roofTypes.${key}.age` as const, {
                            valueAsNumber: true,
                          })}
                          placeholder="อายุ (ปี)"
                          className="w-20 border rounded px-2 py-1"
                        />
                        <label>อายุ (ปี)</label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3.2 Area & Slope */}
            <section className="flex flex-wrap gap-4">
              <div className="flex-1">
                <label className="block mb-1">3.2 ขนาดพื้นที่ (ตร.ม.)</label>
                <input
                  {...register("area", { valueAsNumber: true })}
                  className={inputClasses}
                  placeholder="ขนาดพื้นที่ (ตร.ม.)"
                />
              </div>
              <div className="flex-1">
                <label className={labelClasses}>ความชัน</label>
                <Controller
                  name="slopeDegree"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel id="slope-label">ความชัน</InputLabel>
                      <Select
                        labelId="slope-label"
                        multiple
                        defaultValue={[]}
                        value={field.value}
                        onChange={field.onChange}
                        renderValue={(selected) =>
                          (selected as number[]).map((v) => `${v}°`).join(", ")
                        }
                        label="ความชัน"
                      >
                        {SLOPE_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox checked={field.value.includes(option)} />
                            <ListItemText primary={`${option}°`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </section>

            {/* 3.3 Roof Shapes */}
            <section>
              <h3 className="font-medium mb-1">3.3 รูปทรงหลังคา</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 gap-x-8">
                {SHAPES.map((s) => (
                  <label
                    key={s}
                    className="flex items-center text-center space-x-1"
                  >
                    <input
                      type="checkbox"
                      {...register(`shapes.${s}` as const)}
                      className="h-4 w-4"
                    />
                    <div className="flex flex-col w-full justify-center items-center">
                      <img
                        src={`/roof/${s}.png`}
                        alt={s}
                        className="w-14 h-14"
                      />
                      <span>{s}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* 3.4 Metal Profiles */}
            <section>
              <h3 className="font-medium mb-1">3.4 รูปแบบเมทัลชีท</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 gap-x-8">
                {METAL_PROFILES.map((m) => (
                  <label
                    key={m}
                    className="flex items-center text-center space-x-1"
                  >
                    <input
                      type="checkbox"
                      {...register(`metalProfiles.${m}` as const)}
                      className="h-4 w-4"
                    />
                    <div className="flex flex-col w-full justify-center items-center">
                      <img src={`/roof/${m}.png`} alt={m} className="" />
                      <span>{m}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* 3.5 Pitch */}
            <section className="flex-1">
              <label className="block mb-1">3.5 ความชันหลังคา (องศา)</label>
              <input
                type="number"
                {...register("pitch", { valueAsNumber: true })}
                className="w-full border rounded px-2 py-1"
              />
            </section>

            {/* 3.6 Structure */}
            <section>
              <h3 className="font-medium mb-1">3.6 โครงสร้างหลังคา</h3>
              <div className="flex items-center space-x-3 mb-2">
                <input
                  type="checkbox"
                  {...register(`structure.wood.checked` as const)}
                  className="h-4 w-4"
                />
                <span className="capitalize w-1/3">ไม้</span>

                <Controller
                  name={`structure.wood.type`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel id="wood-label">ชนิด</InputLabel>
                      <Select
                        labelId="wood-label"
                        multiple
                        defaultValue={[]}
                        value={field.value}
                        onChange={field.onChange}
                        renderValue={(selected) =>
                          (selected as string[]).map((v) => `${v}`).join(", ")
                        }
                        label="ความชัน"
                      >
                        {WOOD.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox checked={field.value.includes(option)} />
                            <ListItemText primary={`${option}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <div className="flex items-center space-x-3 mb-2">
                  <label>อายุ </label>

                  <input
                    type="number"
                    {...register(`structure.wood.age` as const, {
                      valueAsNumber: true,
                    })}
                    placeholder="อายุ (ปี)"
                    className="border rounded px-2 py-1 w-20"
                  />
                  <label>ปี </label>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <input
                  type="checkbox"
                  {...register(`structure.steel.checked` as const)}
                  className="h-4 w-4"
                />
                <p className="w-1/3">เหล็ก</p>

                <Controller
                  name={`structure.steel.type`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel id="steel-label">ชนิด</InputLabel>
                      <Select
                        labelId="steel-label"
                        multiple
                        defaultValue={[]}
                        value={field.value}
                        onChange={field.onChange}
                        renderValue={(selected) =>
                          (selected as string[]).map((v) => `${v}`).join(", ")
                        }
                        label="ความชัน"
                      >
                        {STEEL.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox checked={field.value.includes(option)} />
                            <ListItemText primary={`${option}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <label>อายุ</label>

                <input
                  type="number"
                  {...register(`structure.steel.age` as const, {
                    valueAsNumber: true,
                  })}
                  placeholder="อายุ (ปี)"
                  className="border rounded px-2 py-1 w-20"
                />
                <label>ปี</label>
              </div>
            </section>

            {/* 3.7–3.12 Spans */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-1">
              <div>
                <label>3.7 ระยะแป–แป (ม.)</label>
                <input
                  type="number"
                  {...register("span1", { valueAsNumber: true })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label>3.8 ระยะจันทัน–จันทัน (ม.)</label>
                <input
                  type="number"
                  {...register("span2", { valueAsNumber: true })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label>3.9 ระยะเสา–เสา (ม.)</label>
                <input
                  type="number"
                  {...register("baySpacing", { valueAsNumber: true })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label>3.10 ระยะช่องแสง–แป (ม.)</label>
                <input
                  type="number"
                  {...register("lightOpening", { valueAsNumber: true })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label>3.11 ความกว้างสันหลังคาถึงชายคาด้านที่ 1 (ม.)</label>
                <input
                  type="number"
                  {...register("widthEave1", { valueAsNumber: true })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label>3.12 ความกว้างสันหลังคาถึงชายคาด้านที่ 2 (ม.)</label>
                <input
                  type="number"
                  {...register("widthEave2", { valueAsNumber: true })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </section>

            {/* 3.13–3.16 Special Items */}
            <section className="grid grid-cols-2 gap-4">
              {(
                [
                  ["ระบบป้องกันฟ้าผ่า", "lightningProtector"],
                  ["บันไดขึ้นหลังคา", "ladder"],
                  ["Jack roof", "jackRoof"],
                  ["ลูกหมุนระบายอากาศ", "turbine"],
                ] as [string, keyof StructureFormValues][]
              ).map(([label, key], index) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(key)}
                    className="h-4 w-4"
                  />
                  <span>
                    3.1{index + 3} {label}
                  </span>
                </label>
              ))}
            </section>

            {/* 3.17 Other Notes */}
            <section>
              <label className="block mb-1">3.17 อื่นๆ</label>
              <textarea
                {...register("otherNotes")}
                rows={3}
                className="w-full border rounded px-2 py-1"
              />
            </section>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleRequestClose}
                className="px-4 py-2 border rounded"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
