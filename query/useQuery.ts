"use client";
import { useQuery } from "@tanstack/react-query";
import { getSchools } from "./school";
import { getEventByDate } from "./event";

export const useSchoolQuery = (props: { schoolName?: string }) => {
  const { schoolName } = props;
  return useQuery({
    queryKey: ["schools", schoolName],
    queryFn: () => getSchools({ schoolName }),
  });
};

export const useEventQuery = (props: { startDate: Date; endDate: Date }) => {
  const { endDate, startDate } = props;
  return useQuery({
    queryKey: ["event", startDate, endDate],
    queryFn: () => getEventByDate({ start_date: startDate, end_date: endDate }),
  });
};
