"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { TableHead } from "@mui/material";
import { useSchoolQueryPagination } from "@/query/useQuery";
import { master_data } from "@prisma/client";
import type { SortingState } from "@tanstack/react-table";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}
interface Column {
  id: "name" | "code" | "population" | "size" | "density";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
const columnHelper = createColumnHelper<master_data>();

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function createData(name: string, calories: number, fat: number) {
  return { name, calories, fat };
}

export default function RenderMasterTable(props: {
  pageSize: number;
  setPageSize: (v: number) => void;
  setPageIndex: (v: number) => void;
  pageIndex: number;
  schoolQuery: ReturnType<typeof useSchoolQueryPagination>;
}) {
  const { schoolQuery, pageIndex, pageSize, setPageIndex, setPageSize } = props;
  const columns = [
    columnHelper.accessor("no", {
      header: "ลำดับ",
    }),
    columnHelper.accessor("amount", {
      header: "ประมาณการติดตั้ง Solar cell",
    }),
    columnHelper.accessor("kw_pk", {
      header: "KW_PK",
    }),
    columnHelper.accessor("school_name", {
      header: "ชื่อโรงเรียน",
      // cell: ({ row, getValue }) => (
      //   <input
      //     value={getValue<string>()}
      //     onChange={(e) =>
      //       handleEdit({
      //         rowIndex: row.index,
      //         key: "school_name",
      //         value: e.target.value,
      //       })
      //     }
      //     className="w-full bg-transparent p-1 border-b border-gray-300 focus:outline-none"
      //   />
      // ),
    }),
    columnHelper.accessor("address", {
      header: "ที่อยู่",
    }),
    columnHelper.accessor("district", {
      header: "ตำบล",
    }),
    columnHelper.accessor("amphur", {
      header: "เขต",
    }),
    columnHelper.accessor("postcode", {
      header: "รหัสไปรษณีย์",
    }),
    columnHelper.accessor("student", {
      header: "จำนวนนักเรียน",
    }),
    columnHelper.accessor("sector", {
      header: "ภาค",
    }),
    columnHelper.accessor("affiliation", {
      header: "สังกัด",
    }),
    columnHelper.accessor("affillation_district", {
      header: "เขต",
    }),
    columnHelper.accessor("egat", {
      header: "กฟภ.",
    }),
    columnHelper.accessor("rate", {
      header: "กฟภ.",
    }),
    columnHelper.accessor("ca", {
      header: "CA",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("contact_rate", {
      header: "การติดต่อ 15%",
    }),
    columnHelper.accessor("talk_rate", {
      header: "การเจรจา 30%",
    }),
    columnHelper.accessor("interest_rest", {
      header: "ความสนใจ 30%",
    }),
    columnHelper.accessor("install_rate", {
      header: "การติดตั้ง 25%",
    }),
    columnHelper.accessor("score", {
      header: "Score 10 คะแนน",
    }),
    columnHelper.accessor("process", {
      header: "การดำเนินงาน",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("process_date", {
      header: "วันที่ดำเนินการ.",
    }),
    columnHelper.accessor("process_by", {
      header: "ดำเนินการโดย.",
    }),
    columnHelper.accessor("contact_school", {
      header: "ชื่อผู้ประสานงานโรงเรียน",
    }),
    columnHelper.accessor("contact_position", {
      header: "ตำแหน่ง",
    }),
    columnHelper.accessor("contact_phone", {
      header: "เบอร์ติดต่อ",
    }),
    columnHelper.accessor("director_school", {
      header: "ชื่อผู้อำนวยการโรงเรียน",
    }),
    columnHelper.accessor("director_phone", {
      header: "เบอร์ติดต่อ-",
    }),
    columnHelper.accessor("avg_electic", {
      header: "ค่าฟ้าเฉลี่ย/เดือน",
    }),
    columnHelper.accessor("egat_status", {
      header: "สถานะดำเนินการของ กฟภ.",
    }),
    columnHelper.accessor("investor", {
      header: "ผู้ลงทุน",
    }),
    columnHelper.accessor("install_size", {
      header: "กลุ่มขนาดติดตั้ง",
    }),
    columnHelper.accessor("name_school_contact", {
      header: "ชื่อผู้ติดต่อสังกัดสถานศึกษา",
    }),
    columnHelper.accessor("org_phone", {
      header: "เบอร์โทรองค์กรสังกัดสถานศึกษา",
    }),
    columnHelper.accessor("paper_no", {
      header: "เลขที่",
    }),
    columnHelper.accessor("paper_date", {
      header: "วันที่",
    }),
    columnHelper.accessor("no_st", {
      header: "เลขที่ ศธ.",
    }),
    columnHelper.accessor("return_date", {
      header: "วันที่ตอบกลับ",
    }),
    columnHelper.accessor("simulation", {
      header: "Simulation",
    }),
    columnHelper.accessor("proposal", {
      header: "ข้อเสนอโครงการ",
    }),
    columnHelper.accessor("pea_proposal", {
      header: "ข้อเสนอโครงการที่ออกจาก PEA",
    }),
    columnHelper.accessor("pea", {
      header: "PEA",
    }),
    columnHelper.accessor("focus", {
      header: "Focus",
    }),
    columnHelper.accessor("teacher_joe", {
      header: "อาจารย์โจ้",
    }),
    columnHelper.accessor("check_dup", {
      header: "check",
    }),
    columnHelper.accessor("latitude", {
      header: "Latitude",
    }),
    columnHelper.accessor("longitude", {
      header: "Longitude",
    }),
    columnHelper.accessor("chk", {
      header: "chk",
    }),
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: Array.isArray(schoolQuery.data?.data) ? schoolQuery.data.data : [],
    columns: columns,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEdit = (props: {
    rowIndex: number;
    key: keyof master_data;
    value: string;
  }) => {
    console.log("props", props);
    // const updated = [...data];
    // updated[rowIndex][key] = key === "students" ? parseInt(value) : value;
    // setData(updated);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // console.log("schoolQuery.data", schoolQuery.data);
  // const columns = schoolQuery.data
  //   ? (Object.keys(schoolQuery.data[0]) as (keyof master_data)[])
  //   : [];
  return (
    <div
      className="overflow-y-auto max-h-screen border rounded-md"
      style={{ width: "100%", overflow: "auto", position: "relative" }}
    >
      <table className="min-w-full table-auto ">
        <thead className="sticky top-0 bg-white z-10 shadow">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-4 py-2 border cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : " 🔽"
                        : ""}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border whitespace-nowrap"
                    onClick={() => {
                      console.log("context", cell.getContext());
                      console.log("value", cell.getValue());
                      // handleEdit
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="sticky bottom-0 left-0 z-10 bg-white border-t shadow px-4">
        <TablePagination
          component="div"
          count={schoolQuery.data?.total ? schoolQuery.data.total : 0}
          page={props.pageIndex}
          onPageChange={(_, newPage) => table.setPageIndex(newPage)}
          rowsPerPage={props.pageSize}
          onRowsPerPageChange={(e) => {
            console.log("e", e.target.value);
            props.setPageSize(Number(e.target.value));
            props.setPageIndex(0);
          }}
          rowsPerPageOptions={[
            5,
            10,
            20,
            {
              label: "All",
              value: schoolQuery.data ? schoolQuery.data.total : 0,
            },
          ]}
        />
      </div>
    </div>
  );
}
