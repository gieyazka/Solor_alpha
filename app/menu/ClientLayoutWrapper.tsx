// app/menu/ClientLayoutWrapper.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  Home,
  BarChart3,
  Settings,
  FileText,
  Users,
  Calendar,
  Mail,
  Database,
  X,
  FormInputIcon,
  HomeIcon,
} from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useSchoolStore } from "@/stores/index";
import { SchoolData } from "@/@type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import _, { set } from "lodash";
import {
  CalendarMonth,
  Description,
  EventNote,
  HomeFilled,
  Summarize,
} from "@mui/icons-material";
dayjs.locale("th");
export default function ClientLayoutWrapper({
  initialData,
  children,
}: {
  initialData: {
    headers: string[];
    data: SchoolData[];
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const masterStore = useSchoolStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(pathname);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const qs = searchParams.toString(); // ex: "school=12"
    const url = qs ? `${pathname}?${qs}` : pathname;
    setActiveTab(pathname.split("/").pop() || activeTab);
    console.log("pathname", pathname);
    console.log("url", url);
    router.replace(url);
  }, [searchParams, pathname, router]);

  useEffect(() => {
    if (initialData) {
      masterStore.setMasterData(initialData); // ✅ เก็บลง zustand
    }
  }, [initialData]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <div className="min-h-screen   ">
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white z-50 shadow-sm border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                {_.upperFirst(_.last(pathname.split("/")))}
              </h1>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Search - Hidden on mobile, shown on larger screens */}
              <div className="relative hidden md:block">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64"
                />
              </div>
              {/* Mobile search icon */}
              <button className="text-gray-500 hover:text-gray-700 md:hidden">
                <Search size={20} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center text-xs">
                  3
                </span>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <User size={20} />
              </button>
            </div>
          </div>
        </nav>

        <div className="flex  h-screen overflow-hidden">
          {/* Mobile Overlay */}
          {isMobile && sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed left-0 top-16 z-50 h-screen  bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ${
              isMobile
                ? `fixed left-0 top-0 h-full z-50 ${
                    sidebarOpen ? "w-64" : "w-0 overflow-hidden"
                  }`
                : `${sidebarOpen ? "w-64" : "w-16"}`
            }`}
          >
            {/* Mobile close button */}
            {isMobile && (
              <div className="flex justify-end p-4 border-b border-gray-200">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            )}

            <div className="p-4 h-screen ">
              <div className="space-y-2">
                {[
                  { id: "dashboard", icon: HomeFilled, label: "Dashboard" },
                  { id: "summary", icon: Summarize, label: "Summary" },
                  { id: "form", icon: Description, label: "Form" },
                  { id: "survey", icon: EventNote, label: "Survey" },
                  { id: "event", icon: CalendarMonth, label: "Calendar" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      router.replace(`/menu/${item.id}`);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon />
                    {(sidebarOpen || isMobile) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <div
            className={`flex-1 ml-0 transition-all duration-300 ${
              isMobile ? "" : `${sidebarOpen ? "ml-64" : "ml-16"}`
            } overflow-y-auto h-screen`}
          >
            <div className="min-h-screen overflow-y-hidden  bg-white">
              <div className="mt-16 ">{children}</div>
            </div>
          </div>
          {/* Main Content */}
        </div>
      </div>
    </LocalizationProvider>
  );
}
