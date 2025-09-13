"use client";
// stores/schoolStore.ts
import { AppwriteType, eventProps, SchoolData, SchoolProps } from "@/@type";
import { loadEvent } from "@/actions/excel";
import { getAllSchool } from "@/actions/school";
import _ from "lodash";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// type ของข้อมูลโรงเรียน

type SchoolStore = {
  masterData: SchoolProps[];
  masterDataKey: Record<string, AppwriteType<SchoolProps>[]>;
  isLoading: boolean;
  setMasterData: (props: AppwriteType<SchoolProps>[]) => void;
  updateData: (props: { data: AppwriteType<SchoolProps>; id: string }) => void;
  addSchoolRow: (props: { data: SchoolProps }) => void;
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
        masterData: data,
        masterDataKey: _.groupBy(data, "school_name"),
      });
    },
    updateData: ({ id, data }) => {
      // 2. อัปเดตใน masterData
      // console.log("id,data", id, data);
      set((state) => {
        const updatedData = state.masterData.map((row) => {
          // if (row.id.toString() === id) {
          //   console.log("row.id", row.id, data);
          // }
          return String(row["id"]) === id ? { ...row, ...data } : row;
        });
        return {
          masterData: updatedData,
          masterDataKey: _.groupBy(updatedData, "school_name"),
        };
      });
    },
    addSchoolRow: ({ data }) => {
      // 2. อัปเดตใน masterData
      // console.log("id,data", id, data);
      set((state) => {
        const updatedData = _.cloneDeep(state.masterData);
        updatedData.push(data);
        return {
          masterData: updatedData,
          masterDataKey: _.groupBy(updatedData, "school_name"),
        };
      });
    },
  }))
);

// ('{"values":[["575","110","118.44","","โรงเรียนวัดนาวง", ,"177 หมู่ที่ 1","หลักหก","เมืองปทุมธานี","ปทุมธานี","12000","1315         5","กลาง","สพป.ปทุมธานี","1","","3124","20017602594","รอเซ็นต์สัญญ    ญา","","ติดตามเอกสารที่เกี่ยวข้อง","","9","9","10","1","7.3","",""     ","","","","","","19-23 May","ออมสิน","นายชัยณรงค์ มหาแสน","รองผู้    อำนวยการสถานศึกษา","081-5397290","นายจิรัตน์ อยู่ยืน","","","","I      I2","","","","2474","45463","","45342","Nop","Nop","45518","1","","พี่ป้อม","ไม่ซ้ำ","","","File Phat,add","","[{\\"status\\":\\"รอ    อเซ็นต์สัญญา\\",\\"date\\":\\"\\"}]","[{\\"activity\\":\\"ติดตามเอ   อกสารที่เกี่ยวข้อง\\",\\"date\\":\\"\\"},{\\"activity\\":\\"นัดหมา     ายเซ็นต์สัญญา\\",\\"date\\":\\"2025-06-17\\"}]","[{\\"ca\\":\\"200  017602594\\",\\"kw_pk\\":\\"118.44\\",\\"rate\\":\\"3124\\"}]","","","","","","","","","","",0]]}');

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
