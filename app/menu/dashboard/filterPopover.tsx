// components/FilterPopover.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Popover,
  MenuList,
  MenuItem,
  Divider,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { Condition } from "@/@type";
const inputClasses =
  "w-full bg-white text-black placeholder:text-gray-400  px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base";

export default function FilterPopover(props: {
  onSubmit: (condition: Condition, value: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState<Condition | "">("");

  const clearData = () => {
    setSearch("");
    setCondition("");
  };

  const onSubmit = () => {
    props.onSubmit(condition as Condition, search);
  };

  const conditionOption: { value: Condition; label: string }[] = [
    {
      value: ">",
      label: `มากกว่า`,
    },
    {
      value: ">=",
      label: `มากกว่าหรือเท่ากับ`,
    },
    {
      value: "<",
      label: `น้อยกว่า`,
    },
    {
      value: "<=",
      label: `น้อยกว่าหรือเท่ากับ`,
    },
  ];
  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {search !== "" && condition !== ""
          ? `${
              conditionOption.find((d) => d.value === condition)?.label
            } ${search} KW`
          : `เลือก KW_PK`}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          onSubmit();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ width: 260, p: 1 }}>
          {/* จัดเรียง */}
          <p className="p-2 text-center">เงื่อนไข</p>

          {/* <Divider /> */}

          <Divider />
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setCondition(e.target.value as Condition);
            }}
            value={condition}
            className={inputClasses}
          >
            <option value="">ไม่มี</option>
            {conditionOption.map((d) => {
              return (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              );
            })}
          </select>
          {/* Search */}
          <TextField
            size="small"
            placeholder="จำนวน"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ my: 1 }}
          />
          {/* <TextField
            size="small"
            placeholder="ค้นหา…"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ my: 1 }}
          /> */}

          {/* Scrollable checkbox list */}
          {/* <Box sx={{ maxHeight: 160, overflow: "auto" }}>
            <FormGroup>
              {filtered.map((opt) => (
                <FormControlLabel
                  key={opt}
                  control={
                    <Checkbox
                      size="small"
                      checked={selected.includes(opt)}
                      onChange={() => handleToggle(opt)}
                    />
                  }
                  label={opt}
                />
              ))}
            </FormGroup>
          </Box> */}

          {/* Actions */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{ mt: 1 }}
          >
            <Button
              size="small"
              onClick={() => {
                clearData();
                // setAnchorEl(null);
                // onSubmit();
              }}
            >
              ยกเลิก
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                setAnchorEl(null);
                onSubmit();
              }}
            >
              ตกลง
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
