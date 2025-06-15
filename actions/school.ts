"use server";
import { SchoolData } from "@/@type";
import PrismaDB from "../db";
import { loadMasterData } from "./excel";
const prisma = PrismaDB;

export const getMaster = async () => {
  try {
    const master = await loadMasterData();
    return master as { headers: string[]; data: SchoolData[] };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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
    return schools;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getAllSchools() {
  try {
    const schools = await prisma.master_data.findMany({
      orderBy: { id: "asc" },
    });
    return schools;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getSchoolsPagination(props: {
  schoolName?: string;
  page: number;
  size: number;
}) {
  const { schoolName } = props;
  try {
    const [rows, total] = await Promise.all([
      prisma.master_data.findMany({
        where:
          schoolName !== ""
            ? {
                school_name: {
                  contains: schoolName, // เหมือน LIKE '%บ้านคลอง%'
                  mode: "insensitive", // ไม่สนตัวพิมพ์เล็ก-ใหญ่
                },
              }
            : undefined,
        take: props.size,
        skip: props.page * props.size,
        orderBy: { id: "asc" },
      }),
      prisma.master_data.count(),
    ]);

    // const row = prisma.master_data.findMany({
    //   where:
    //     schoolName !== ""
    //       ? {
    //           school_name: {
    //             contains: schoolName, // เหมือน LIKE '%บ้านคลอง%'
    //             mode: "insensitive", // ไม่สนตัวพิมพ์เล็ก-ใหญ่
    //           },
    //         }
    //       : undefined,
    //   take: props.size,
    //   skip: props.page * props.size,
    //   orderBy: { id: "asc" },
    // });

    // const total = await prisma.master_data.count();
    return { data: rows, total };
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
