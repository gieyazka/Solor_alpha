import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { getSchools } from "@/actions/school";
import { useSchoolQuery } from "@/actions/useQuery";
import { master_data } from "@prisma/client";
import { SchoolData } from "@/@type";

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
  masterData: SchoolData[];
  handleChangeSchool: (d: SchoolData) => void;
}) {
  const { masterData } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [searchValue, setSerachValue] = React.useState<string | undefined>();

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // const schoolQuery = useSchoolQuery({ schoolName: searchValue });
  // React.useEffect(() => {
  // เคลียร์ timeout เดิมก่อน
  // if (debounceRef.current) {
  //   clearTimeout(debounceRef.current);
  // }
  // if (inputValue === "") {
  //   setSerachValue(inputValue || undefined);
  // } else {
  //   // ตั้ง timeout ใหม่ 3 วินาที
  //   debounceRef.current = setTimeout(() => {
  //     setLoading(true);
  //     setSerachValue(inputValue || undefined);
  //   }, 1000); // ← debounce 1.5 วินาที
  // }
  // return () => {
  //   if (debounceRef.current) {
  //     clearTimeout(debounceRef.current);
  //   }
  // };
  // }, [inputValue]);
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

  const optionScool = React.useMemo(() => {
    if (inputValue !== "") {
      return masterData
        .filter((d) => d?.["ชื่อโรงเรียน"].includes(inputValue))
        .splice(0, 49);
    }
    return masterData.splice(0, 21);
  }, [inputValue]);
  // const optionScool = schoolQuery.data?.map((d) => {
  //   return d;
  // });
  return (
    <Autocomplete
      // sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={(event, value) => {
        setInputValue(value);
      }}
      isOptionEqualToValue={(option, value) => {
        return option?.["ชื่อโรงเรียน"] === value?.["ชื่อโรงเรียน"];
      }}
      onChange={(event: any, newValue) => {
        props.handleChangeSchool(newValue as SchoolData);
      }}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option?.["ชื่อโรงเรียน"]}
      options={optionScool ?? []}
      // loading={schoolQuery.isFetching}
      renderInput={(params) => (
        <TextField
          {...params}
          label="School"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {/* {schoolQuery.isFetching ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null} */}
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
