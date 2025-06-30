import { Condition } from "@/@type";

export const formatNumber = (val: string) => {
  let input = val.replace(/,/g, "");

  // ตรวจสอบว่าเป็นตัวเลขทศนิยมที่ถูกต้อง เช่น "1234", "1234.5", "0.25", "0.", ".25"
  if (!/^\d*(\.\d*)?$/.test(input)) return;

  // แยกส่วนจำนวนเต็มและทศนิยม
  const [intPartRaw, decPart] = input.split(".");
  const intPart = intPartRaw.replace(/^0+(?!$)/, ""); // ลบ 0 นำหน้า เช่น 00012 → 12

  // ถ้าไม่มีจำนวนเต็มเลย ให้ถือว่าเป็น 0
  const formattedInt = intPart ? Number(intPart).toLocaleString() : "0";

  // รวมกลับ: ถ้ามี ".", เก็บไว้
  let result = formattedInt;
  if (input.endsWith(".")) {
    result += ".";
  } else if (decPart !== undefined) {
    result += "." + decPart;
  }
  return result;
};

export function toThaiNumber(input: string) {
  return input.replace(/\d/g, (d) => "๐๑๒๓๔๕๖๗๘๙"[parseInt(d)]);
}

export const parseNumber = (val: string) => val.replace(/,/g, "");

export const ops: Record<Condition, (a: number, b: number) => boolean> = {
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
};

// const uploadedFile: { message?: string; data: resFile } =
//   await uploadFile.json();
// const imageUrl = formatUrlFile({
//   bucketId: uploadedFile.data.bucketId,
//   fileId: uploadedFile.data.$id!,
// });

export const formatUrlFile = ({
  bucketId,
  fileId,
}: {
  bucketId: string;
  fileId: string;
}) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};
