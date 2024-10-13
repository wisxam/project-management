"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/app/state";
import { useGetProjectsQuery } from "@/app/state/api";
import { Project } from "@/app/types/projectTypes";
import { SidebarLinksProps } from "@/app/types/sidebarLinksProps";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  Home,
  Layers3,
  LockIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(false);
  const [showPriorities, setShowPriorities] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null); // New state to track selected project

  const { data: project } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl bg-white
    transition-all duration-600 h-full z-40 dark:bg-black overflow-y-auto 
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  overflow-x-hidden`;
  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* Top Logo */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="pb-3 text-xl font-bold text-gray-800 dark:text-white">
            <p className="text-center">Project Management</p>
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() =>
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
              }
            >
              <X className="h-6 w-6 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        {/* Team */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              Wissam Team
            </h3>
            <div className="mt-1 flex gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* Navbar links */}
        <nav className="z-10 flex w-full flex-col gap-4">
          <SidebarLinks icon={Home} href={"/"} label="Home" />
          <SidebarLinks icon={Briefcase} href={"/timeline"} label="Timeline" />
          <SidebarLinks icon={Search} href={"/search"} label="Search" />
          <SidebarLinks icon={Settings} href={"/settings"} label="Settings" />
          <SidebarLinks icon={User} href={"/users"} label="users" />
          <SidebarLinks icon={Users} href={"/team"} label="Teams" />
        </nav>

        {/* Projects Links */}
        <button
          onClick={() => {
            setShowProjects(!showProjects);
          }}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500 hover:bg-gray-100"
        >
          <span className="">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* Projects List */}

        {showProjects && project && <ProjectsRender projects={project} />}

        {/* Priorities Links */}
        <button
          onClick={() => {
            setShowPriorities(!showPriorities);
          }}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500 hover:bg-gray-100"
        >
          <span className="">Priority</span>
          {showPriorities ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriorities && (
          <nav className="z-10 flex w-full flex-col gap-4">
            <SidebarLinks
              icon={AlertCircle}
              href={"/priority/urgent"}
              label="Urgent"
            />
            <SidebarLinks
              icon={ShieldAlert}
              href={"/priority/high"}
              label="HIgh"
            />
            <SidebarLinks
              icon={AlertTriangle}
              href={"/priority/medium"}
              label="Medium"
            />
            <SidebarLinks
              icon={AlertOctagon}
              href={"/priority/low"}
              label="Low"
            />
            <SidebarLinks
              icon={Layers3}
              href={"/priority/backlog"}
              label="Backlog"
            />
          </nav>
        )}
      </div>
    </div>
  );
};

const SidebarLinks = ({ href, icon: Icon, label }: SidebarLinksProps) => {
  const pathName = usePathname();
  const isActive =
    pathName === href || (pathName === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[3px] bg-blue-200" />
        )}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {label}
        </span>
        {pathName.includes("projects") && isActive && (
          <button className="ml-auto">
            <EllipsisVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
    </Link>
  );
};

type ProjectRender = {
  projects: Project[];
};

const ProjectsRender = ({ projects }: ProjectRender) => {
  return (
    <div>
      {projects?.map((proj) => (
        <div key={proj.id} className="py-2">
          <SidebarLinks
            icon={Briefcase}
            label={proj.name}
            href={`/projects/${proj.id}`}
          />
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
