import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// โหลด plugin ครั้งเดียว
dayjs.extend(utc);
dayjs.extend(timezone);

// ตั้ง timezone default (ถ้าต้องการ)
dayjs.tz.setDefault("Asia/Bangkok");

export default dayjs;
