"use client";
import dayjs from "@/utils/dayjs";
import { useState } from "react";
import { Calendar, dayjsLocalizer, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { eventProps, SchoolProps } from "@/@type";
const localizer = dayjsLocalizer(dayjs);
const RenderCalendar = (props: {
  keyMaster: { [k: string]: SchoolProps };
  handleChangeDate: (v: Date) => void;
  handleOpenEventModal: (v: eventProps) => void;

  events?: Event[];
}) => {
  return (
    <>
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
              onClick={() => props.handleOpenEventModal(event.resource)}
              style={{ cursor: "pointer" }}
            >
              📌 {event.title}
            </div>
          ),
        }}
      />
    </>
  );
};

export default RenderCalendar;
