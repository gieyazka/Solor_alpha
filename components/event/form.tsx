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
import { getSchools } from "@/query/school";
import { useQuery } from "@tanstack/react-query";
import { useSchoolQuery } from "@/query/useQuery";
import { master_data } from "@/generated/prisma";
import { createEvent } from "@/query/event";
import { TransitionProps } from "@mui/material/transitions";
import dayjs from "dayjs";

export default function EventForm(props: {
  refetchEvent: () => void;
  open: boolean;
  handleClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [schoolData, setSchoolData] = useState<master_data>();
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
      const res = await createEvent({
        schoolId: schoolData.id,
        start: dayjs(start).toDate(),
        team: team,
        title,
        description,
      });
      setSnackbarState({
        type: "success",
        open: true,
        remark: "Create Event success",
      });
      props.refetchEvent();
      onClose();
    } catch (error) {
      console.log("error", error);
      setSnackbarState({
        type: "error",
        open: true,
        remark: JSON.stringify(error),
      });
    }
  };

  const handleChangeSchool = (data: master_data | undefined) => {
    setSchoolData(data);
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
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 500,
            overflowY: "auto", // fallback ถ้า Tailwind ไม่ทำงาน
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
              <AsynSchoolAutoComplete handleChangeSchool={handleChangeSchool} />

              <TextField
                label="Province"
                value={schoolData?.province || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.province ? true : false,
                  },
                }}
                fullWidth
              />
              <TextField
                label="Contact person"
                value={schoolData?.contact_school || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.contact_school ? true : false,
                  },
                }}
                fullWidth
              />
              <TextField
                label="Contact phone"
                value={schoolData?.contact_phone || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  inputLabel: {
                    shrink: schoolData?.contact_phone ? true : false,
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
