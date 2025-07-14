"use client";
import { useQuery } from "@tanstack/react-query";
import { getSchools, getSchoolsPagination } from "./school";
import { getEventByDate } from "./event";
import { getSurvey,  } from "./survey";

export const useSchoolQuery = (props: { schoolName?: string }) => {
  const { schoolName } = props;
  return useQuery({
    queryKey: ["schools", schoolName],
    queryFn: () => getSchools({ schoolName }),
  });
};
export const useSchoolQueryPagination = (props: {
  schoolName?: string;
  page?: number;
  size: number;
}) => {
  const { schoolName, size, page = 1 } = props;

  return useQuery({
    queryKey: ["schools", schoolName, page, size],
    queryFn: () => getSchoolsPagination({ schoolName, page, size }),
  });
};

export const useEventQuery = (props: { startDate: Date; endDate: Date }) => {
  const { endDate, startDate } = props;
  return useQuery({
    queryKey: ["event", startDate, endDate],
    queryFn: () => getEventByDate({ start_date: startDate, end_date: endDate }),
  });
};

export const useSurveyQuery = (props: {
  page: number;
  size: number;
}) => {
  const { page, size } = props;
  return useQuery({
    queryKey: ["survey", page, size],
    queryFn: () => getSurvey({ page, size }),
  });
};
