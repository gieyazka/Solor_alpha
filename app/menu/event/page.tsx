import { getAllCalendar } from "@/actions/calendar";
import { loadEvent } from "@/actions/excel";
import { getAllSchool } from "@/actions/school";
import { RenderEvent } from "@/components/event";

import "react-big-calendar/lib/css/react-big-calendar.css";

export const dynamic = "force-dynamic";

const CalendarPage = async () => {

  const eventData = await getAllCalendar();
  return (
    <div className="flex flex-col h-screen  ">
      <RenderEvent eventData={eventData} />
    </div>
  );
};

export default CalendarPage;
