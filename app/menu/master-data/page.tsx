import RenderMasterData from "@/components/master_data";
import { getAllSchools } from "@/query/school";

const CalendarPage = async () => {
  // console.time("getSchool");

  // const schoolData = await getAllSchools();
  // console.timeEnd("getSchool");
  return (
    <div className="flex flex-col h-screen  ">
      <RenderMasterData />
    </div>
  );
};

export default CalendarPage;
