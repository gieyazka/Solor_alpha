"use client";
import { event_schedule } from "@/generated/prisma";
import { getEventByDate } from "@/actions/event";
import { useEventQuery } from "@/actions/useQuery";
import dayjs from '@/utils/dayjs';
import { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = dayjsLocalizer(dayjs);
const RenderCalendar = (props: {
  handleChangeDate: (v: Date) => void;
  handleOpenEventModal: (
    v: Awaited<ReturnType<typeof getEventByDate>>[0]
  ) => void;

  events?:
    | {
        start: Date;
        end: Date;
        title: string;
        allDay: boolean;
        eventData: event_schedule;
      }[]
    | undefined;
}) => {
  return (
    <Calendar
      onNavigate={(date) => props.handleChangeDate(date)}
      localizer={localizer}
      events={props.events}
      startAccessor="start"
      endAccessor="end"
      style={{ padding: "12px", height: "100%", width: "100%" }}
      // onSelectEvent={(event) => {
      //   console.log("คลิกอีเวนต์:", event);
      //   alert(`คุณคลิก "${event.title}"`);
      // }}

      // eventPropGetter={(event) => ({
      //   style: {
      //     backgroundColor: "red",
      //     color: "white",
      //     borderRadius: "4px",
      //     padding: "4px",
      //     height: "100%",
      //   },
      // })}
      components={{
        event: ({ event }) => (
          <div
            onClick={() =>
              props.handleOpenEventModal(
                event.eventData as Awaited<ReturnType<typeof getEventByDate>>[0]
              )
            }
            style={{ cursor: "pointer" }}
          >
            📌 {event.title}
          </div>
        ),
      }}
    />
  );
};

export default RenderCalendar;
