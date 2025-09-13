import { Models } from "node-appwrite";

export type Condition = ">" | ">=" | "<" | "<=" | "==" | "!=";

export type SchoolData = {
  id: string;
  ลำดับ: string;
  "ประมาณการติดตั้ง Solar cell": string;
  KW_PK: number;
  ตรวจสอบสถานที่: string;
  ชื่อโรงเรียน: string;
  ที่อยู่: string;
  ชื่อตำบล: string;
  ชื่ออำเภอ: string;
  ชื่อจังหวัด: string;
  รหัสไปรษณีย์: number;
  จำนวนนักเรียน: string;
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
  "ความเข้าใจในโมเดล ESCO (10%)": string;
  "ระดับความร่วมมือของโรงเรียน (10%)": string;
  "การตัดสินใจและอำนาจภายใน (10%)": string;
  "ความพร้อมในการให้ข้อมูล (10%)": string;
  "การค้างค่าไฟฟ้า (10%)": string;

  "พื้นที่ติดตั้งที่มีอยู่ (10%)": string;
  "สภาพวัสดุมุงหลังคา (10%)": string;
  "สภาพโครงสร้าง (10%)": string;
  "จุดเชื่อมต่อและการเดินสายไฟ (10%)": string;
  "การเข้าถึงหน้างาน (10%)": string;
  รวมคะแนน: string;

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

export type AppwriteType<T> = Models.Document & T;

export type eventProps = AppwriteType<calendarProps> & {
  schoolData?: AppwriteType<SchoolProps>;
};

export type survey = {
  school_name: string;
  location?: string;
  gps?: string;
  kwp?: number;
  contact_name?: string;
  contact_phone?: string;
  surveyor?: string;
  behavior?: (Models.Document & surveyUserBehavior)[];
  roofplan?: boolean;
  buildingplan?: boolean;
  elecplan?: boolean;
  monthlybill?: boolean;
  loadprofile?: boolean;
  building?: (Models.Document & SurveyBuilding)[];
  survey?: string;
  transformer?: (Models.Document & surveyTransformer)[];
  cabinet?: AppwriteType<surveyCabinet>[];
  rooftop_image?: string[];
  bottom_view_image?: string[];
  install_solar: AppwriteType<surveySolarInstall>[];
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
  image?: string[];
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
export type calendarProps = {
  team: string;
  title: string;
  description: string;
  school_id: number;
  date: Date;
  is_delete?: boolean;
};

export type SchoolProps = {
  id: number;
  no?: number;
  solarEst?: number;
  location_checked?: boolean;
  school_name: string;
  school_address?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  post_code?: string;
  total_students?: number;
  school_region?: string;
  school_affiliation?: string;
  school_district?: string;
  electricity_provider?: string;
  power_rate?: number;
  ca?: string;
  kw_pk?: number;
  operation_status?: string;
  contact_email?: string;
  school_contact_name?: string;
  school_contact_position?: string;
  school_contact_phone?: string;
  school_director?: string;
  school_director_phone?: string;
  electricity_avg_month?: number;
  investor_name?: string;
  moe_doc_no?: string;
  moe_doc_date?: string;
  pea_no?: string;
  pea_date?: string;
  cover_sheet_no?: string;
  cover_sheet_date?: string;
  book_no?: string;
  book_date?: string;
  moe_proposal_no?: string;
  proposal_date?: string;
  simulation?: string;
  latitude?: number;
  longitude?: number;
  status?: string[];
  activity?: string[];
  meter?: string[];
  total_kw_pk?: number;
  esco_understanding_score?: number;
  score_cooperation?: number;
  score_decision_power?: number;
  score_data_readiness?: number;
  score_electricity_arrears?: number;
  note_school?: string;
  score_install_area?: number;
  score_roof_material?: number;
  score_structure?: number;
  score_connection_wiring?: number;
  score_site_access?: number;
  note_site?: string;
  score_total?: number;
  link_invitation?: string;
  link_acceptance?: string;
  link_proposal?: string;
};
