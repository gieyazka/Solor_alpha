// "use client";

// import dayjs from "@/utils/dayjs";
// import RenderCalendar from "./calendar";
// import { useState } from "react";
// import { useEventQuery } from "@/actions/useQuery";
// import { Box, Button, Modal, Typography } from "@mui/material";
// import EventForm from "./form";
// import { getEventByDate } from "@/actions/event";
// import { useQueryClient } from "@tanstack/react-query";
// import { SchoolData } from "@/@type";

// export const RenderEvent = (props: { masterData: SchoolData[] }) => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const eventQuery = useEventQuery({
//     endDate: dayjs(currentDate).endOf("month").toDate(),
//     startDate: dayjs(currentDate).startOf("month").toDate(),
//   });
//   const queryClient = useQueryClient();
//   const refetchEvent = () => {
//     queryClient.invalidateQueries({ queryKey: ["event"] });
//   };

//   const [eventModal, setEventModal] = useState<{
//     open: boolean;
//     data?: Awaited<ReturnType<typeof getEventByDate>>[0];
//   }>({ open: false, data: undefined });
//   const [eventForm, setEventForm] = useState<{
//     open: boolean;
//   }>({ open: false });

//   const handleOpenEventModal = (
//     d: Awaited<ReturnType<typeof getEventByDate>>[0]
//   ) => {
//     setEventModal({ open: true, data: d });
//   };
//   const handleCloseEventModal = () => {
//     setEventModal({ open: false, data: undefined });
//   };

//   const handleChangeDate = (e: Date) => {
//     setCurrentDate(e);
//   };

//   const evnetData = eventQuery.data?.map((d) => {
//     return {
//       title: d.master_data.school_name,
//       start: d.date, // 10 มิ.ย. 2025 10:00
//       end: d.date, // 10 มิ.ย. 2025 11:00
//       allDay: false,
//       eventData: d,
//       color: "red", // ฟิลด์กำหนดสีเอง
//       id: d.id,
//     };
//   });

//   const onOpenForm = () => {
//     setEventForm({
//       open: true,
//     });
//   };
//   const onCloseForm = () => {
//     setEventForm({
//       open: false,
//     });
//   };

//   return (
//     <div className="flex flex-col flex-1  h-screen  ">
//       <ModalDetail
//         handleClose={handleCloseEventModal}
//         open={eventModal.open}
//         data={eventModal.data}
//       />
//       <EventForm
//         refetchEvent={refetchEvent}
//         handleClose={onCloseForm}
//         open={eventForm.open}
//       />
//       <div className="p-4 flex justify-end w-full ">
//         <Button variant="contained" onClick={onOpenForm}>
//           + Event
//         </Button>
//       </div>
//       <RenderCalendar
//         handleChangeDate={handleChangeDate}
//         handleOpenEventModal={handleOpenEventModal}
//         events={evnetData}
//       />
//     </div>
//   );
// };

// const ModalDetail = (props: {
//   open: boolean;
//   data?: Awaited<ReturnType<typeof getEventByDate>>[0];
//   handleClose: () => void;
// }) => {
//   const { data } = props;
//   const schoolData = data?.master_data;
//   return (
//     <Modal open={props.open} onClose={props.handleClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: {
//             xs: "90%", // 📱 มือถือ: กว้าง 90%
//             sm: 500, // 💻 หน้าจอ ≥ 600px: กว้าง 500px
//           },
//           maxHeight: "90vh",
//           overflowY: "auto",
//           bgcolor: "background.paper",
//           borderRadius: 3,
//           boxShadow: 24,
//           p: {
//             xs: 2,
//             sm: 4,
//           },
//         }}
//       >
//         <Typography variant="h5" fontWeight="bold" gutterBottom>
//           📍 {schoolData?.school_name}
//         </Typography>

//         <Box sx={{ mb: 2 }}>
//           <Typography variant="body1" color="text.secondary">
//             ผู้ประสานงาน: <strong>{schoolData?.contact_school}</strong> (
//             {schoolData?.contact_position})
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             เบอร์โทร: <strong>{schoolData?.contact_phone}</strong>
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             ผู้อำนวยการ: <strong>{schoolData?.director_school}</strong> (
//             {schoolData?.director_phone})
//           </Typography>
//         </Box>

//         <Box sx={{ borderTop: "1px solid #ccc", mt: 2, pt: 2 }}>
//           <Typography variant="h6" fontWeight="medium" gutterBottom>
//             📅 {data?.title}
//           </Typography>

//           <Typography variant="body1">
//             วันเวลา:{" "}
//             <strong>
//               {data?.date
//                 ? dayjs(data.date).format("DD MMMM YYYY เวลา HH:mm")
//                 : "-"}
//             </strong>
//           </Typography>

//           {data?.description && (
//             <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
//               {data.description}
//             </Typography>
//           )}
//         </Box>
//       </Box>
//     </Modal>
//   );
// };
