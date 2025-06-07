"use server";
import { master_data, PrismaClient } from "@/generated/prisma";
import PrismaDB from "../db";
const prisma = PrismaDB;
export async function getSchools(props: { schoolName?: string }) {
  const { schoolName } = props;
  try {
    const schools = await prisma.master_data.findMany({
      where: schoolName
        ? {
            school_name: {
              contains: schoolName, // เหมือน LIKE '%บ้านคลอง%'
              mode: "insensitive", // ไม่สนตัวพิมพ์เล็ก-ใหญ่
            },
          }
        : undefined,
      take: schoolName ? 1000 : 50,
      orderBy: { id: "asc" },
    });
    return schools as master_data[];
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
