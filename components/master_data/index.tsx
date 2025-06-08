"use client";
import { useSchoolQuery, useSchoolQueryPagination } from "@/actions/useQuery";
import RenderMasterTable from "./table";
import React from "react";

const RenderMasterData = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const schoolQuery = useSchoolQueryPagination({
    schoolName: "",
    size: pageSize,
    page: pageIndex,
  });
  return (
    <div className="flex flex-col flex-1  h-screen  ">
      <div className="m-4">
        <RenderMasterTable
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          schoolQuery={schoolQuery}
        />
      </div>
    </div>
  );
};

export default RenderMasterData;
