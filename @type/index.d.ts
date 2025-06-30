export type Condition = ">" | ">=" | "<" | "<=" | "==" | "!=";

export type SchoolData = {
  id: number;
  ลำดับ: number;
  "ประมาณการติดตั้ง Solar cell": number;
  KW_PK: number;
  ตรวจสอบสถานที่: string;
  ชื่อโรงเรียน: string;
  ที่อยู่: string;
  ชื่อตำบล: string;
  ชื่ออำเภอ: string;
  ชื่อจังหวัด: string;
  รหัสไปรษณีย์: number;
  จำนวนนักเรียน: number;
  ภาค: string;
  สังกัด: string;
  เขต: string;
  กฟภ: string;
  อัตรา: string;
  CA: string;
  Status: string;
  "การติดต่อ 15%": number;
  "การเจรจา 30%": number;
  "ความสนใจ 30%": number;
  "กำลังติดตั้ง 25%": number;
  "Score 10คะแนน": number;
  "ความเข้าใจในโมเดล ESCO (10%)": number;
  "ระดับความร่วมมือของโรงเรียน (10%)": number;
  "การตัดสินใจและอำนาจภายใน (10%)": number;
  "ความพร้อมในการให้ข้อมูล (10%)": number;
  "การค้างค่าไฟฟ้า (10%)": number;

  "พื้นที่ติดตั้งที่มีอยู่ (10%)": number;
  "สภาพวัสดุมุงหลังคา (10%)": number;
  "สภาพโครงสร้าง (10%)": number;
  "จุดเชื่อมต่อและการเดินสายไฟ (10%)": number;
  "การเข้าถึงหน้างาน (10%)": number;
  รวมคะแนน: number;

  การดำเนินงาน: string;
  "E-mail": string;
  วันที่ดำเนินการ: string;
  activity?: string;
  ดำเนินการโดย: string;
  ชื่อผู้ประสานงานโรงเรียน: string;
  ตำแหน่ง: string;
  เบอร์ติดต่อผู้ประสานงาน: string;
  ชื่อผู้อำนวยการโรงเรียน: string;
  "เบอร์ติดต่อ ผอ.": string;
  "ค่าฟ้าเฉลี่ย/เดือน": string;
  "สถานะดำเนินการของ กฟภ.": string;
  ผู้ลงทุน: string;
  กลุ่มขนาดติดตั้ง: string;
  ชื่อผู้ติดต่อสังกัดสถานศึกษา: string;
  เบอร์โทรองค์กรสังกัดสถานศึกษา: string;
  เลขที่: string;
  วันที่: string;
  "เลขที่ ศธ": string;
  วันที่ตอบกลับ: string;
  Simulation: string;
  ข้อเสนอโครงการ: string;
  "ข้อเสนอโครงการที่ออกจาก PEA": string;
  PEA: number;
  Focus: string;
  อาจารย์โจ้: string;
  check: string;
  Latitude: string;
  Longitude: string;
  chk: string;
  statusArr: string;
  activityArr: string;
  meterArr: string;
  หมายเหตุของโรงเรียน: string;
  หมายเหตุของพื้นที่: string;
  เลขที่หนังสือ: string;
  วันที่หนังสือ: string;
  "เลขที่ ศธ ข้อเสนอ": string;
  วันที่ข้อเสนอ: string;
  เลขที่ใบปะหน้า: string;
  วันที่ใบปะหน้า: string;
  รวมKW_PK: string;
  "link ข้อเสนอโครงการ": string;
  "link หนังสือเชิญ": string;
  "link หนังสือตอบรับข้อเสนอ": string;
  location: string;
  meterArrObject: { rate: string; ca: string; kw_pk: string }[];
  statusArrObject: { status: string; date?: string }[];
  activityArrObject: { activity: string; date?: string }[];
};

export type eventProps = {
  id?: number;
  team: string;
  title: string;
  description: string | null;
  school_id: number;
  date: string;
  schoolData?: SchoolData;
};

export type survey = {
  school_name: string;
  location?: string;
  gps?: string;
  kwp?: number;
  contact_name?: string;
  contact_phone?: string;
  surveyor?: string;
  behavior?: surveyUserBehavior[];
  roofplan?: boolean;
  buildingplan?: boolean;
  elecplan?: boolean;
  monthlybill?: boolean;
  loadprofile?: boolean;
  buildings?: SurveyBuilding[];
  survey?: string;
  transformer?: surveyTransformer[];
  cabinet?: surveyCabinet[];
  rooftop_image?: string[];
  bottom_view_image?: string[];
  install_solar: surveySolarInstall[];
  topview_image?: string[];
  bottomview_image?: string[];
};

export type SurveyBuilding = {
  /** Relationship ID to parent survey_building document */
  survey: survey;
  /** ชื่ออาคาร */
  building_name?: string;

  /** Roof Types */
  roof_type_roman?: boolean;
  roof_type_roman_age?: number;
  roof_type_cpac?: boolean;
  roof_type_cpac_age?: number;
  roof_type_prestige?: boolean;
  roof_type_prestige_age?: number;
  roof_type_slab?: boolean;
  roof_type_slab_age?: number;
  roof_type_metalsheet?: boolean;
  roof_type_metalsheet_age?: number;
  roof_type_other?: boolean;
  roof_type_other_age?: number;
  roof_type_other_label?: string;

  /** Area and slope */
  area?: number;
  slope_degree?: number[];

  /** Roof Shapes */
  shapes_open_gable?: boolean;
  shapes_box_gable?: boolean;
  shapes_hip?: boolean;
  shapes_flat?: boolean;
  shapes_dutch_gable?: boolean;
  shapes_saltbox?: boolean;
  shapes_dormer?: boolean;
  shapes_shed?: boolean;
  shapes_m_shaped?: boolean;
  shapes_pyramid_hip?: boolean;
  shapes_clerestory?: boolean;

  /** Metal Sheet Types */
  metalsheet_CR_700KL?: boolean;
  metalsheet_CR_750BL?: boolean;
  metalsheet_CR_750W?: boolean;
  metalsheet_CR_600W?: boolean;
  metalsheet_CR_650BL?: boolean;

  /** Pitch */
  pitch?: number;

  /** Structure Types */
  structure_wood?: boolean;
  structure_wood_type?: string[];
  structure_wood_age?: number;
  structure_steel?: boolean;
  structure_steel_type?: string[];
  structure_steel_age?: number;

  /** Structural Dimensions */
  purlin_purlin?: number;
  rafter_rafter?: number;
  pillar_pillar?: number;
  skylight_purlin?: number;
  width_roof_one?: number;
  width_roof_two?: number;

  /** Additional Equipment */
  lightning_protector?: boolean;
  ladder?: boolean;
  jack_roof?: boolean;
  turbine?: boolean;

  /** หมายเหตุเพิ่มเติม */
  remark?: string;
};

export type surveyCabinet = {
  type: string;
  cabinet: string;
  image?: string[];
  survey: survey;
};
export type surveySolarInstall = {
  name: string;
  image?: File[];
  survey: survey;
};
export type surveyUserBehavior = {
  meter_type: string;
  building: string;
  average_electric: number;
  survey: survey;
};
export type surveyTransformer = {
  location: string;
  meter: string;
  survey: survey;
};
