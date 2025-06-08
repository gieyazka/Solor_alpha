"use server";
import dayjs from "dayjs";
import PrismaDB from "../db";
import { sendMessageToLine } from "./line";
const prisma = PrismaDB;

export type eventCreateProps = {
  description?: string;
  start: Date;
  team: string;
  title: string;
  schoolId: number;
};

export const createEvent = async (props: eventCreateProps) => {
  try {
    const res = await prisma.event_schedule.create({
      data: {
        team: props.team,
        title: props.title,
        description: props.description,
        date: props.start,
        school_id: props.schoolId, // ← id จาก master_data
      },
      include: { master_data: true },
    });
    try {
      sendMessageToLine(res);
    } catch (error) {}
    return res;
  } catch (error) {
    console.error("Error create event:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export async function getEventByDate(props: {
  start_date: Date;
  end_date: Date;
}) {
  const { end_date, start_date } = props;
  try {
    const eventData = await prisma.event_schedule.findMany({
      where: {
        date: {
          gte: dayjs(start_date).startOf("day").toDate(),
          lte: dayjs(end_date).endOf("day").toDate(),
        },
      },
      include: {
        master_data: true,
      },
      orderBy: { date: "asc" },
    });
    return eventData;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getEventById(id: number) {
  try {
    const eventData = await prisma.event_schedule.findMany({
      where: {
        id: id,
      },
      include: {
        master_data: true,
      },
      orderBy: { date: "asc" },
    });
    return eventData;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
