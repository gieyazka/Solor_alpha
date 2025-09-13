"use client";

import dayjs from "@/utils/dayjs";
import RenderCalendar from "./calendar";
import { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import EventForm from "./form";
import { useQueryClient } from "@tanstack/react-query";
import { AppwriteType, calendarProps, eventProps, SchoolData } from "@/@type";
import { Event } from "react-big-calendar";
import { useSchoolStore } from "@/stores";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { deleteCalendar } from "@/actions/calendar";
import EditEventForm from "./form_edit";

export const RenderEvent = (props: { eventData: calendarProps[] }) => {
  const router = useRouter();
  const { eventData } = props;
  const schollStore = useSchoolStore();
  const masterData = schollStore.masterData;
  const keyMaster = Object.fromEntries(masterData.map((d) => [d.id, d]));

  const [currentDate, setCurrentDate] = useState(new Date());
  // const eventQuery = useEventQuery({
  //   endDate: dayjs(currentDate).endOf("month").toDate(),
  //   startDate: dayjs(currentDate).startOf("month").toDate(),
  // });
  const queryClient = useQueryClient();
  const refetchEvent = () => {
    queryClient.invalidateQueries({ queryKey: ["event"] });
  };

  const [eventModal, setEventModal] = useState<{
    open: boolean;
    data?: eventProps;
  }>({ open: false, data: undefined });
  const [eventForm, setEventForm] = useState<{
    open: boolean;
  }>({ open: false });
  const [editEvent, setEditEvent] = useState<{
    open: boolean;
    data?: eventProps;
  }>({ open: false, data: undefined });

  const handleOpenEventModal = (eventData: eventProps) => {
    setEventModal({ open: true, data: eventData });
  };
  const handleCloseEventModal = () => {
    setEventModal({ open: false, data: undefined });
  };

  const handleChangeDate = (e: Date) => {
    setCurrentDate(e);
  };
  const event: Event[] = eventData
    ?.map((d) => {
      const schoolData = keyMaster?.[d.school_id?.toString()];
      return {
        title: schoolData?.["school_name"],
        start: dayjs(d.date).toDate(), // 10 มิ.ย. 2025 10:00
        end: dayjs(d.date).toDate(), // 10 มิ.ย. 2025 11:00
        allDay: false,
        resource: { ...d, schoolData },
        color: "red", // ฟิลด์กำหนดสีเอง
        // id: d.id,
      };
    })
    .filter((d) => d?.title !== undefined);
  // const eventData = eventQuery.data?.map((d) => {
  //   return {
  //     title: d.master_data.school_name,
  //     start: d.date, // 10 มิ.ย. 2025 10:00
  //     end: d.date, // 10 มิ.ย. 2025 11:00
  //     allDay: false,
  //     eventData: d,
  //     color: "red", // ฟิลด์กำหนดสีเอง
  //     id: d.id,
  //   };
  // });

  const onOpenForm = () => {
    setEventForm({
      open: true,
    });
  };
  const onCloseForm = () => {
    setEventForm({
      open: false,
    });
  };
  const handleOpenEditEvent = (eventData: eventProps) => {
    setEditEvent({ open: true, data: eventData });
  };
  const onCloseEditForm = () => {
    setEditEvent({
      open: false,
    });
  };
  const handleDeleteCalendar = async (docId: string) => {
    Swal.fire({
      title: "Do you want to delete the event?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Confirm",
      reverseButtons: true,
      denyButtonText: `Cancel`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          await deleteCalendar(docId);
          router.refresh();
          Swal.fire("Saved!", "", "success");
        } catch (error) {
          console.error("Error deleting calendar:", error);
          Swal.fire("Error deleting calendar", "", "error");
        }
      } else if (result.isDenied) {
        // Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  return (
    <div className="flex flex-col flex-1  h-screen  ">
      <ModalDetail
        handleOpenEditEvent={handleOpenEditEvent}
        handleDeleteCalendar={handleDeleteCalendar}
        handleClose={handleCloseEventModal}
        open={eventModal.open}
        data={eventModal.data}
      />
      <EditEventForm
        data={editEvent.data}
        keyMaster={keyMaster}
        masterData={masterData}
        refetchEvent={refetchEvent}
        handleClose={onCloseEditForm}
        handleCloseEventModal={handleCloseEventModal}
        open={editEvent.open}
      />
      <EventForm
        keyMaster={keyMaster}
        masterData={masterData}
        refetchEvent={refetchEvent}
        handleClose={onCloseForm}
        open={eventForm.open}
      />
      <div className="p-4 flex justify-end w-full ">
        <Button variant="contained" onClick={onOpenForm}>
          + Event
        </Button>
      </div>
      <RenderCalendar
        keyMaster={keyMaster}
        handleChangeDate={handleChangeDate}
        handleOpenEventModal={handleOpenEventModal}
        events={event}
      />
    </div>
  );
};

const ModalDetail = (props: {
  open: boolean;
  data?: eventProps;
  handleClose: () => void;
  handleDeleteCalendar: (id: string) => void;
  handleOpenEditEvent: (data: eventProps) => void;
}) => {
  const { data, handleDeleteCalendar, handleOpenEditEvent } = props;
  const schoolData = data?.schoolData;

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%", // 📱 มือถือ: กว้าง 90%
            sm: 500, // 💻 หน้าจอ ≥ 600px: กว้าง 500px
          },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: {
            xs: 2,
            sm: 4,
          },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          color="text.primary"
        >
          📍 {schoolData?.["school_name"]}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            ผู้ประสานงาน: <strong>{schoolData?.["school_contact_name"]}</strong>{" "}
            ({schoolData?.["school_contact_position"]})
          </Typography>
          <Typography variant="body1" color="text.secondary">
            เบอร์โทร: <strong>{schoolData?.["school_contact_phone"]}</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ผู้อำนวยการ: <strong>{schoolData?.["school_director"]}</strong> (
            {schoolData?.["school_director_phone"]})
          </Typography>
        </Box>

        <Box sx={{ borderTop: "1px solid #ccc", mt: 2, pt: 2 }}>
          <Typography
            variant="h6"
            fontWeight="medium"
            gutterBottom
            color="text.primary"
          >
            📅 {data?.title}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            วันเวลา:{" "}
            {data?.date
              ? dayjs(data.date).format("DD MMMM YYYY เวลา HH:mm")
              : "-"}
          </Typography>

          {data?.description && (
            <Typography variant="body2" sx={{ mt: 1 }} color="text-black">
              {data.description}
            </Typography>
          )}
        </Box>

        <div className="flex gap-4 mt-4 w-full">
          <Button
            onClick={() => {
              handleDeleteCalendar(data!.$id);
            }}
            className="flex-1 w-full"
            variant="contained"
            color="error"
          >
            ลบ
          </Button>
          <Button
            onClick={() => {
              handleOpenEditEvent(data!);
            }}
            className="flex-1 w-full"
            variant="contained"
            color="primary"
          >
            แก้ไข
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
