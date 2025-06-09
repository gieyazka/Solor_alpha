import { loadEvent } from "@/actions/excel";
import { getMaster } from "@/actions/school";
import { RenderEvent } from "@/components/event";

import "react-big-calendar/lib/css/react-big-calendar.css";
const CalendarPage = async () => {
  const masterData = await getMaster();

  const eventData = await loadEvent();
  return (
    <div className="flex flex-col h-screen  ">
      <RenderEvent masterData={masterData} eventData={eventData} />
    </div>
  );
};

export default CalendarPage;
