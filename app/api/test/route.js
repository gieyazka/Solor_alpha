import { NextResponse } from "next/server";
import { sendMessageToLine } from "@/actions/line";
import { loadMasterData, writeToSheet,testFn } from "@/actions/excel";

export async function GET(req) {
  try {
    // testFn()
    // const master = await loadMasterData();
    // const test = await writeToSheet();
    // console.log("master", master);
    // const data = {
    //   id: 25,
    //   team: "BD/EN",
    //   title: "Site Survey",
    //   description: "",
    //   school_id: 1010,
    //   date: `2025-06-04T04:44:00.000Z`,
    //   master_data: {
    //     no: "24",
    //     amount: null,
    //     kw_pk: null,
    //     school_name: "โรงเรียนนวมินทราชูทิศ กรุงเทพมหานคร",
    //     address: "115 หมู่ 11 นวมินทร์ 163",
    //     district: "นวลจันทร์",
    //     amphur: "เขตบึงกุ่ม",
    //     province: "กรุงเทพมหานคร",
    //     postcode: "10230",
    //     student: "2303",
    //     sector: "กลาง",
    //     affiliation: "สพม.กรุงเทพมหานคร",
    //     affillation_district: "2",
    //     egat: "กฟภ.",
    //     rate: null,
    //     ca: null,
    //     status: "ตอบรับหนังสือเชิญ",
    //     contact_rate: "7",
    //     talk_rate: "7",
    //     interest_rest: "8",
    //     install_rate: "0",
    //     score: "5.5",
    //     process:
    //       "นัด 1 เมษา แอดไลน์เบอร์โทร ทำหนังสือเพื่อ      อขอเข้าไปนำเสนอ",
    //     email: null,
    //     process_date: "19-23 May",
    //     process_by: null,
    //     contact_school: "นายชัชวาล  พฤกษ์พงพันธ์",
    //     contact_position: "รองผู้อำนวยการโรงเรียน",
    //     contact_phone: "083-534-5827",
    //     director_school: "นายสุรศักดิ์ การุญ",
    //     director_phone: "02-944-1225 ต่อ 1152",
    //     avg_electic: "ไม่มีค่าไฟ",
    //     egat_status: null,
    //     investor: null,
    //     install_size: null,
    //     name_school_contact: "ดร.นภาพร พงษ์ขัน",
    //     org_phone: "02-930-4490-92",
    //     paper_no: "2690",
    //     paper_date: "45469",
    //     no_st: "๐๔๒๙๑.๑๗/๕๒๗",
    //     return_date: "45464",
    //     simulation: "Pla",
    //     proposal: null,
    //     pea_proposal: null,
    //     pea: null,
    //     focus: "M000258",
    //     teacher_joe: "อาจารย์โจ้",
    //     check_dup: "ไม่ซ้ำ",
    //     latitude: null,
    //     longitude: null,
    //     chk: "File Phat",
    //     id: 1010,
    //   },
    // };

    // const res = sendMessageToLine(data);
    // console.log("res", res);
    // return NextResponse.json({ data: res }, { status: 200 });
    return NextResponse.json({ error: "Test" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
