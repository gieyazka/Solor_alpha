"use client"
// stores/schoolStore.ts
import { eventProps, SchoolData } from "@/@type";
import { loadEvent } from "@/actions/excel";
import { getMaster } from "@/actions/school";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// type ของข้อมูลโรงเรียน

type SchoolStore = {
  masterData: SchoolData[];
  isLoading: boolean;
  setMasterData: (data: SchoolData[]) => void;
  fetchMasterData: () => Promise<void>; // async fn สำหรับ getMaster()
};
type eventStore = {
  event: eventProps[];
  isLoading: boolean;

  setEvent: (data: eventProps[]) => void;
  fetchEvent: () => Promise<void>; // async fn สำหรับ getMaster()
};

export const useSchoolStore = create<SchoolStore>()(
  immer((set) => ({
    masterData: [],
    isLoading: false,
    setMasterData: (data) => set({ masterData: data }),
    fetchMasterData: async () => {
      set((state) => {
        state.isLoading = true;
      });
      const data = await getMaster();
      set((state) => {
        state.masterData = data;
        state.isLoading = false;
      });
    },
  }))
);

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
