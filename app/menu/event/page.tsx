import { loadEvent } from "@/actions/excel";
import { getMaster } from "@/actions/school";
import { RenderEvent } from "@/components/event";

import "react-big-calendar/lib/css/react-big-calendar.css";

export const dynamic = "force-dynamic";

const CalendarPage = async () => {

  const eventData = await loadEvent();
  return (
    <div className="flex flex-col h-screen  ">
      <RenderEvent eventData={eventData} />
    </div>
  );
};

export default CalendarPage;
