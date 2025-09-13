import { SchoolData } from "@/@type";
import { Autocomplete, TextField } from "@mui/material";
import clsx from "clsx";
import React from "react";

export const CustomAutoComplete = (props: {
  label: string;
  dataKey: Record<string, any[]>;
  handleChange: (d: string[] | undefined) => void;
}) => {
  const { dataKey, label } = props;
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const optionScool = React.useMemo(() => {
    if (inputValue !== "") {
      return dataKey
        ? Object.keys(dataKey)
            .filter((d) => d.includes(inputValue))
            .splice(0, 200)
        : [];
    }
    return dataKey ? Object.keys(dataKey).splice(0, 200) : [];
  }, [inputValue, dataKey]);
  return (
    <div className="flex flex-col relative">
      <Autocomplete
        multiple
        open={open}
        onOpen={handleOpen}
        // onClose={handleClose}
        onClose={(event, reason) => {
          // console.log('reason', reason)
          if (reason === "blur" || reason === "escape") {
            handleClose();
          }
        }}
        onInputChange={(event, value) => {
          setInputValue(value);
        }}
        sx={{
          "& .MuiAutocomplete-tag": {
            display: "none", // ✅ ซ่อน Chip
          },
          "& .MuiAutocomplete-inputRoot": {
            maxHeight: 40, // ป้องกันช่อง input ขยาย
            overflow: "hidden",
          },
        }}
        onChange={(event: any, newValue) => {
          props.handleChange(newValue || "");
          setSelected(newValue);
        }}
        getOptionLabel={(option) => String(option).replace("_", " เขต ")}
        options={optionScool ?? Object.keys(dataKey).splice(0, 200)}
        // loading={schoolQuery.isFetching}
        limitTags={1}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            {selected && <span className="text-green-500 mr-2">✔</span>}
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            // label="ชื่อสถานศึกษา"
            placeholder={
              selected.length > 0
                ? `เลือกแล้ว ${selected.length} รายการ`
                : label
            }
            variant="standard"
            // InputLabelProps={{ shrink: true }}

            slotProps={{
              input: {
                ...params.InputProps,

                disableUnderline: true,
                className: clsx(
                  params.inputProps?.className, // ✅ สำคัญ: รักษา default class ของ MUI ไว้
                  "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                ),
              },
              root: {
                className: "w-full",
              },
            }}
          />
        )}
      />
      {/* <p>เลือกแล้ว {selected.length}</p> */}
    </div>
  );
};
export const CustomSingleAutoComplete = (props: {
  label: string;
  dataKey: Record<string, any[]>;
  handleChange: (d: string | undefined) => void;
}) => {
  const { dataKey, label } = props;
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const optionScool = React.useMemo(() => {
    if (inputValue !== "") {
      return dataKey
        ? Object.keys(dataKey)
            .filter((d) => d.includes(inputValue))
            .splice(0, 200)
        : [];
    }
    return dataKey ? Object.keys(dataKey).splice(0, 200) : [];
  }, [inputValue, dataKey]);
  return (
    <div className="flex flex-col relative">
      <Autocomplete
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        onInputChange={(event, value) => {
          setInputValue(value);
        }}
        sx={{
          "& .MuiAutocomplete-tag": {
            display: "none", // ✅ ซ่อน Chip
          },
          "& .MuiAutocomplete-inputRoot": {
            maxHeight: 40, // ป้องกันช่อง input ขยาย
            overflow: "hidden",
          },
        }}
        onChange={(event: any, newValue) => {
          props.handleChange(newValue || "");
          setSelected(newValue);
        }}
        getOptionLabel={(option) => String(option).replace("_", " เขต ")}
        options={optionScool ?? Object.keys(dataKey).splice(0, 200)}
        // loading={schoolQuery.isFetching}
        limitTags={1}
        renderOption={(props, option, { selected }) => {
          return (
            <li {...props} key={option}>
              {selected && <span className="text-green-500 mr-2">✔</span>}
              {option}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            // label="ชื่อสถานศึกษา"
            placeholder={label}
            variant="standard"
            // InputLabelProps={{ shrink: true }}

            slotProps={{
              input: {
                ...params.InputProps,

                disableUnderline: true,
                className: clsx(
                  params.inputProps?.className, // ✅ สำคัญ: รักษา default class ของ MUI ไว้
                  "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                ),
              },
              root: {
                className: "w-full",
              },
            }}
          />
        )}
      />
      {/* <p>เลือกแล้ว {selected.length}</p> */}
    </div>
  );
};
