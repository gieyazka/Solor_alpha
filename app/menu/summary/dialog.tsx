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
            <ListItemButton
              key={school}
            //   selected={selectedSchool === school}
            //   onClick={() => onSelect(school)}
              sx={{
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
              <ListItemText
                primary={school}
                primaryTypographyProps={{ variant: "body1" }}
                secondary={masterData.masterDataKey[school]['0'].ชื่อจังหวัด}
              />
            </ListItemButton>
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
