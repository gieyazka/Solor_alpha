// lib/appwrite.ts
import { Client, Account, Databases, Storage } from 'appwrite';

export async function createClientAppwrite() {
  // 1) ตั้งค่า client ด้วย endpoint + project
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)   // e.g. https://api.example.com/v1
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!); // Project ID จาก Console

  // 2) สร้าง account service
  const account = new Account(client);

  // 3) ตรวจสอบว่ามี session สร้างไว้แล้วหรือยัง
  //    ถ้ายัง (เช่น cookie ไม่มี หรือ session หมดอายุ) → สร้าง Anonymous Session ใหม่
  try {
    await account.get(); // จะโยน error ถ้าไม่มี session
  } catch {
    await account.createAnonymousSession();
  }

  // 4) คืน service ต่าง ๆ ให้เรียกใช้ต่อได้
  return {
    account,                         // ใช้ login / logout / getSession / createJWT
    database: new Databases(client), // ใช้งาน Databases APIs
    storage:  new Storage(client),   // ใช้งาน Storage APIs
  };
}
