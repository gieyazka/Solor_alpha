import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { getSchools } from "@/actions/school";
import { useSchoolQuery } from "@/actions/useQuery";
import { master_data } from "@prisma/client";

interface Film {
  title: string;
  year: number;
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function AsynSchoolAutoComplete(props: {
  handleChangeSchool: (d: master_data) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [searchValue, setSerachValue] = React.useState<string | undefined>();
  const [schoolSelect, setSchoolSelect] = React.useState<master_data>();
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const schoolQuery = useSchoolQuery({ schoolName: searchValue });
  React.useEffect(() => {
    // เคลียร์ timeout เดิมก่อน
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (inputValue === "") {
      setSerachValue(inputValue || undefined);
    } else {
      // ตั้ง timeout ใหม่ 3 วินาที
      debounceRef.current = setTimeout(() => {
        setLoading(true);
        setSerachValue(inputValue || undefined);
      }, 1000); // ← debounce 1.5 วินาที
    }
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue]);
  const handleOpen = () => {
    setOpen(true);
    (async () => {
      // setLoading(true);
      // await sleep(1e3); // For demo purposes.
      // setLoading(false);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    // setOptions([]);
  };

  const optionScool = schoolQuery.data?.map((d) => {
    return d;
  });
  return (
    <Autocomplete
      // sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={(event, value) => {
        setInputValue(value);
      }}
      isOptionEqualToValue={(option, value) =>
        option?.school_name === value?.school_name
      }
      onChange={(event: any, newValue) => {
        setSchoolSelect(newValue as master_data);
        props.handleChangeSchool(newValue as master_data);
      }}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.school_name}
      options={optionScool ?? []}
      loading={schoolQuery.isFetching}
      renderInput={(params) => (
        <TextField
          {...params}
          label="School"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {schoolQuery.isFetching ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
}
