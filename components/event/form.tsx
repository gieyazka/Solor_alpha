"use client";

import { useState } from "react";
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
import AsynSchoolAutoComplete from "./school-autocomplete";
import { getSchools } from "@/actions/school";
import { useQuery } from "@tanstack/react-query";
import { useSchoolQuery } from "@/actions/useQuery";
import { createEvent } from "@/actions/event";
import { TransitionProps } from "@mui/material/transitions";
import dayjs from "@/utils/dayjs";
import { master_data } from "@prisma/client";
import { sendMessageToLine } from "@/actions/line";
import { SchoolData } from "@/@type";
import { writeToSheet } from "@/actions/excel";
import { useRouter } from "next/navigation";
import { useSchoolStore } from "@/stores";
import { SchoolAutoComplete } from "@/app/menu/form/page";

export default function EventForm(props: {
  keyMaster: { [k: string]: SchoolData };

  refetchEvent: () => void;
  open: boolean;
  handleClose: () => void;
  masterData: SchoolData[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [schoolData, setSchoolData] = useState<SchoolData>();
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
    try {
      const res = await writeToSheet({
        school_id: schoolData.id,
        date: dayjs(start).toISOString(),
        team: team,
        title,

        description,
        schoolData: schoolData,
      });
      // const res = await createEvent({
      //   schoolId: schoolData.id,
      //   start: dayjs(start).toDate(),
      //   team: team,
      //   title,
      //   description,
      // });
      router.refresh();
      // props.refetchEvent();
      onClose();
      setSnackbarState({
        type: "success",
        open: true,
        remark: "Create Event success",
      });
    } catch (error) {
      console.log("error", error);
      setSnackbarState({
        type: "error",
        open: true,
        remark: JSON.stringify(error),
      });
    }
  };

  const handleChangeSchool = (data: SchoolData[] | undefined) => {
    const d = data?.[0];
    if (d && d.ชื่อโรงเรียน) {
      setSchoolData(d);
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
                Create event
              </Typography>

              <IconButton onClick={onClose} aria-label="close">
                X
              </IconButton>
            </div>
            <Stack spacing={3}>
              <SchoolAutoComplete
                readOnly={false}
                value={schoolData?.["ชื่อโรงเรียน"] || ""}
                masterDataKey={masterStore.masterDataKey}
                handleChangeSchool={handleChangeSchool}
              />
              <TextField
                label="Province"
                value={schoolData?.["ชื่อจังหวัด"] || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.["ชื่อจังหวัด"] ? true : false,
                  },
                }}
                fullWidth
              />
              <TextField
                label="Contact person"
                value={schoolData?.["ชื่อผู้ประสานงานโรงเรียน"] || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.["ชื่อผู้ประสานงานโรงเรียน"]
                      ? true
                      : false,
                  },
                }}
                fullWidth
              />
              <TextField
                label="Contact phone"
                value={schoolData?.["เบอร์ติดต่อผู้ประสานงาน"] || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.["เบอร์ติดต่อผู้ประสานงาน"]
                      ? true
                      : false,
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
                onChange={(e) => setStart(e.target.value)}
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
