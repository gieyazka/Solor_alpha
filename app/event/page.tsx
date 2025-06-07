import { RenderEvent } from "@/components/event";


import "react-big-calendar/lib/css/react-big-calendar.css";
const CalendarPage = async () => {
  return (
    <div className="flex flex-col h-screen  ">
      <RenderEvent />
    </div>
  );
};

export default CalendarPage;
