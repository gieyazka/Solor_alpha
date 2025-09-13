"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Snackbar,
  GrowProps,
  Grow,
  Alert,
  AlertColor,
  Modal,
  IconButton,
} from "@mui/material";
import dayjs from "@/utils/dayjs";
import { sendMessageToLine } from "@/actions/line";
import { AppwriteType, eventProps, SchoolProps } from "@/@type";
import { writeToSheet } from "@/actions/excel";
import { useRouter } from "next/navigation";
import { useSchoolStore } from "@/stores";
import { SchoolAutoComplete } from "@/app/menu/form/page";
import { createCalendar, updateCalendar } from "@/actions/calendar";
import Swal from "sweetalert2";

export default function EditEventForm(props: {
  keyMaster: { [k: string]: SchoolProps };
  data?: eventProps;
  refetchEvent: () => void;
  open: boolean;
  handleClose: () => void;
  handleCloseEventModal: () => void;
  masterData: SchoolProps[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [schoolData, setSchoolData] = useState<AppwriteType<SchoolProps>>();
  const [snackbarState, setSnackbarState] = useState<{
    type: AlertColor | undefined;
    open: boolean;
    remark: string;
  }>({
    type: undefined,
    open: false,
    remark: "",
  });
  // console.log('schoolData', schoolData)
  const masterStore = useSchoolStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (schoolData?.id === undefined) {
      setSnackbarState({
        type: "error",
        open: true,
        remark: "Please select school",
      });
      return;
    }

    Swal.fire({
      title: "Do you want to edit the event?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Confirm",
      reverseButtons: true,
      denyButtonText: `Cancel`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          const res = await updateCalendar({
            id: props.data!.$id,
            data: {
              school_id: schoolData.id,
              date: dayjs(start).toDate(),
              team: team,
              title,
              description,
            },
          });
          const event: Partial<eventProps> = {
            school_id: schoolData.id,
            date: dayjs(start).toDate(),
            team: team,
            title,
            description,
            schoolData: schoolData,
          };

          await sendMessageToLine(event);
          router.refresh();
          // props.refetchEvent();
          onClose();
          setSnackbarState({
            type: "success",
            open: true,
            remark: "Edit Event success",
          });
          props.handleCloseEventModal();
        } catch (error) {
          console.log("error", error);
          setSnackbarState({
            type: "error",
            open: true,
            remark: JSON.stringify(error),
          });
        }
      } else if (result.isDenied) {
        // Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleChangeSchool = (data: SchoolProps[] | undefined) => {
    const d = data?.[0];
    if (d && d["school_name"]) {
      setSchoolData(d as AppwriteType<SchoolProps>);
    }
  };
  const statusOptions = [
    "Project Present",
    "Site Survey",
    "Project Present - Site Survey",
    "Clear Proposal & Draft Contract",
    "Clear Proposal - Site Survey",
    "Sign Contract",
  ];

  const teamOptions = ["BD/EN", "EN", "BD"];

  function GrowTransition(props: GrowProps) {
    return <Grow {...props} />;
  }

  const handleCloseSnackBar = () => {
    setSnackbarState({
      type: undefined,
      open: false,
      remark: "",
    });
  };

  const onClose = () => {
    setTitle("");
    setTeam("");
    setDescription("");
    setStart("");
    setSchoolData(undefined);
    props.handleClose();
  };

  useEffect(() => {
    if (props.open && props.data) {
      setSchoolData(props.data?.schoolData);
      setTitle(props.data?.title!);
      setTeam(props.data?.team!);
      setDescription(props.data?.description!);
      setStart(dayjs(props.data!.date!).format("YYYY-MM-DDTHH:mm"));
    } else {
      setSchoolData(undefined);
      setTitle("");
      setTeam("");
      setDescription("");
      setStart("");
    }
  }, [props.open, props.data]);

  return (
    <div className="">
      <Snackbar
        color="error"
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        slots={{
          transition: GrowTransition,
        }}
        key={snackbarState.open ? "visible" : "hidden"}
        open={snackbarState.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={snackbarState.remark}
      >
        <Alert
          severity={"success"}
          sx={{
            alignItems: "center",
            fontWeight: 600,
            fontSize: "1.5rem", // ขนาดตัวอักษร
            width: "100%",
            minWidth: "400px", // กำหนดขนาดขั้นต่ำ
          }}
          onClose={handleCloseSnackBar}
        >
          {snackbarState.remark}
        </Alert>
      </Snackbar>
      <Modal open={props.open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: {
              xs: 0, // 📱 มือถือ: ชิดบน
              sm: "50%", // 💻 หน้าจอใหญ่: กลางจอ
            },
            left: {
              xs: 0,
              sm: "50%",
            },
            transform: {
              xs: "none", // มือถือ: ไม่ต้องแปล
              sm: "translate(-50%, -50%)", // จอใหญ่: จัดกลางจอ
            },
            width: "100%",
            maxWidth: 500,
            height: {
              xs: "100vh", // มือถือ: เต็มจอ
              sm: "auto", // จอใหญ่: สูงตามเนื้อหา
            },
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: {
              xs: 0,
              sm: 3,
            },
            bgcolor: "background.paper",
            boxShadow: 24,
          }}
        >
          <Paper
            elevation={3}
            sx={{ margin: "auto", padding: "12px 24px 20px 24px" }}
            component="form"
            onSubmit={handleSubmit}
          >
            <div className="flex justify-between items-center mb-2">
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Edit event
              </Typography>

              <IconButton onClick={onClose} aria-label="close">
                X
              </IconButton>
            </div>
            <Stack spacing={3}>
              <SchoolAutoComplete
                readOnly={false}
                value={schoolData?.["school_name"] || ""}
                masterDataKey={masterStore.masterDataKey}
                handleChangeSchool={handleChangeSchool}
              />
              <TextField
                label="Province"
                value={schoolData?.["province"] || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.["province"] ? true : false,
                  },
                }}
                fullWidth
              />
              <TextField
                label="Contact person"
                value={schoolData?.["school_contact_name"] || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.["school_contact_name"] ? true : false,
                  },
                }}
                fullWidth
              />
              <TextField
                label="Contact phone"
                value={schoolData?.["school_contact_phone"] || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.["school_contact_phone"] ? true : false,
                  },
                }}
                fullWidth
              />

              <FormControl>
                <InputLabel id="title-label">Event name</InputLabel>
                <Select
                  label="ชื่อกิจกรรม"
                  labelId="title-label"
                  value={title}
                  onChange={(event: SelectChangeEvent) => {
                    setTitle(event.target.value);
                  }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Date"
                type="datetime-local"
                value={start}
                onChange={(e) => {
                  console.log("e", e.target.value);
                  setStart(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <FormControl>
                <InputLabel id="team-label">Dept</InputLabel>
                <Select
                  labelId="team-label"
                  value={team}
                  onChange={(event: SelectChangeEvent) => {
                    setTeam(event.target.value);
                  }}
                  label="ทีมที่ไป"
                >
                  {teamOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Remark"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />

              <Button type="submit" variant="contained" color="primary">
                บันทึก
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Modal>
    </div>
  );
}
