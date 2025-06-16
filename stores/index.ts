"use client";
// stores/schoolStore.ts
import { eventProps, SchoolData } from "@/@type";
import { loadEvent } from "@/actions/excel";
import { getMaster } from "@/actions/school";
import _ from "lodash";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// type ของข้อมูลโรงเรียน

type SchoolStore = {
  masterData: SchoolData[];
  masterDataKey: Record<string, SchoolData[]>;
  headers: string[];
  isLoading: boolean;
  setMasterData: (props: { headers: string[]; data: SchoolData[] }) => void;
  updateData: (props: { data: string[]; id: string }) => void;
  // fetchMasterData: () => Promise<void>; // async fn สำหรับ getMaster()
};
type eventStore = {
  event: eventProps[];
  isLoading: boolean;

  setEvent: (data: eventProps[]) => void;
  // fetchEvent: () => Promise<void>; // async fn สำหรับ getMaster()
};

export const useSchoolStore = create<SchoolStore>()(
  immer((set, get) => ({
    masterData: [],
    masterDataKey: {},
    headers: [],
    isLoading: false,
    setMasterData: (data) => {
      set({
        headers: data.headers,
        masterData: data.data,
        masterDataKey: _.groupBy(data.data, "ชื่อโรงเรียน"),
      });
    },
    updateData: ({ id, data }) => {
      const headers = get().headers.slice(1);

      // 1. แปลง string[] + headers → object
      const newRow = headers.reduce<Record<string, any>>((obj, key, i) => {
        obj[key] = data[i] ?? "";
        return obj;
      }, {});

      // 2. อัปเดตใน masterData
      set((state) => {
        const updatedData = state.masterData.map((row) =>
          String(row["id"]) === id ? { ...row, ...newRow } : row
        );

        return {
          masterData: updatedData,
          masterDataKey: _.groupBy(updatedData, "ชื่อโรงเรียน"),
        };
      });
    },
  }))
);

('{"values":[["575","110","118.44","","โรงเรียนวัดนาวง", ,"177 หมู่ที่ 1","หลักหก","เมืองปทุมธานี","ปทุมธานี","12000","1315         5","กลาง","สพป.ปทุมธานี","1","","3124","20017602594","รอเซ็นต์สัญญ    ญา","","ติดตามเอกสารที่เกี่ยวข้อง","","9","9","10","1","7.3","",""     ","","","","","","19-23 May","ออมสิน","นายชัยณรงค์ มหาแสน","รองผู้    อำนวยการสถานศึกษา","081-5397290","นายจิรัตน์ อยู่ยืน","","","","I      I2","","","","2474","45463","","45342","Nop","Nop","45518","1","","พี่ป้อม","ไม่ซ้ำ","","","File Phat,add","","[{\\"status\\":\\"รอ    อเซ็นต์สัญญา\\",\\"date\\":\\"\\"}]","[{\\"activity\\":\\"ติดตามเอ   อกสารที่เกี่ยวข้อง\\",\\"date\\":\\"\\"},{\\"activity\\":\\"นัดหมา     ายเซ็นต์สัญญา\\",\\"date\\":\\"2025-06-17\\"}]","[{\\"ca\\":\\"200  017602594\\",\\"kw_pk\\":\\"118.44\\",\\"rate\\":\\"3124\\"}]","","","","","","","","","","",0]]}');

export const useEventStore = create<eventStore>()(
  immer((set) => ({
    event: [],
    isLoading: false,
    setEvent: (data) => set({ event: data }),
    fetchEvent: async () => {
      const data = await loadEvent();
      set((state) => {
        state.event = data;
      });
    },
  }))
);
