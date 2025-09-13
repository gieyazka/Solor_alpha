import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import { useSchoolStore } from "@/stores";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import _ from "lodash";

interface FancySchoolDialogProps {
  open: boolean;
  schools: string[];
  selectedSchool?: string;
  onClose: () => void;
  onSelect: (school: string) => void;
}
const FancySchoolDialog: React.FC<FancySchoolDialogProps> = ({
  open,
  schools,
  selectedSchool,
  onClose,
  onSelect,
}) => {
  const router = useRouter();
  const masterData = useSchoolStore();
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      schools.filter((s) =>
        s.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [search, schools]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 2,
        }}
      >
        <Typography variant="h6">เลือกโรงเรียน</Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2, px: 4 }}>
        <TextField
          placeholder="🔍 ค้นหาโรงเรียน..."
          variant="outlined"
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <List sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
          {filtered.map((school) => (
            <Box
              key={school}
              //   selected={selectedSchool === school}
              //   onClick={() => onSelect(school)}
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 1,
                mb: 1,
                transition: "background-color 0.2s",
                "&.Mui-selected": {
                  bgcolor: "action.selected",
                },
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "secondary.light" }}>
                  <SchoolIcon />
                </Avatar>
              </ListItemAvatar>
              <div className="flex justify-between flex-1">
                <div className="flex flex-col">
                  <p className="font-bold text-sm ">
                    {school} : {masterData.masterDataKey[school]?.[0]?.province}
                  </p>
                  <p className="text-xs font-light">
                    {masterData.masterDataKey[school]?.[0]?.status?.length
                      ? JSON.parse(
                          _.last(
                            masterData.masterDataKey[school]?.[0]?.status
                          ) ?? "[]"
                        ).status
                      : "ยังไม่ระบุสถานะ"}
                  </p>
                </div>
                <button
                  className="p-2 text-yellow-600 hover:bg-orange-50 rounded-full transition-colors"
                  title="แก้ไข"
                  onClick={() => {
                    const schoolData = masterData.masterDataKey[school];
                    if (schoolData) {
                      router.replace(`/menu/form?school=${schoolData["0"].id}`);
                    }
                  }}
                >
                  <Edit className="w-6 h-6" />
                </button>
              </div>
            </Box>
          ))}

          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              ไม่มีผลลัพธ์
            </Box>
          )}
        </List>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose}>ปิด</Button>
        {/* <Button
          variant="contained"
          onClick={() => {
            if (selectedSchool) onClose();
          }}
          disabled={!selectedSchool}
        >
          ยืนยัน
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default FancySchoolDialog;
