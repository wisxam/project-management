"use client";

import { useState } from "react";
import ModalNewTask from "@/components/ModalNewTask";
import Header from "@/components/Header";
import { Priority } from "@/app/types/priorityTypes";
import { useGetTasksByUserQuery } from "@/app/state/api";
import { useAppSelector } from "@/app/redux";
import { Task } from "@/app/types/taskTypes";
import TaskCard from "@/components/PagesComponents/TaskCard";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { tailChase } from "ldrs";
import { dataGridClassNames, dataGridSxStyles } from "@/app/projects/lib/utils";

tailChase.register();

type Props = {
  priority: Priority;
};

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 100 },
  { field: "description", headerName: "Description", width: 200 },
  { field: "priority", headerName: "Priority", width: 75 },
  { field: "tags", headerName: "Tags", width: 130 },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  { field: "startDate", headerName: "Start Date", width: 130 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const userId = 1;
  const {
    data: tasks,
    isLoading,
    isError: isTaskError,
  } = useGetTasksByUserQuery(userId || 0, {
    skip: userId === null,
  });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority,
  );

  if (isTaskError || !tasks) return <div>Error fetching priority tasks.</div>;

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      {filteredTasks && filteredTasks.length > 0 ? (
        <>
          <div className="mb-4 flex justify-start gap-4">
            <button
              className={`w-auto ${view === "list" ? "bg-gray-300 hover:bg-gray-400 dark:bg-zinc-900" : "bg-gray-100 hover:bg-gray-200"} rounded-md bg-gray-100 px-4 py-1 dark:bg-dark-tertiary dark:text-white dark:hover:bg-dark-secondary`}
              onClick={() => setView("list")}
            >
              List
            </button>
            <button
              className={`w-auto ${view === "table" ? "bg-gray-300 hover:bg-gray-400 dark:bg-zinc-900" : "bg-gray-100 hover:bg-gray-200"} rounded-md px-4 py-1 dark:bg-dark-tertiary dark:text-white dark:hover:bg-dark-secondary`}
              onClick={() => setView("table")}
            >
              Table
            </button>
          </div>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <l-tail-chase size="40" speed="1.75" color="gray" />
            </div>
          ) : view === "list" ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredTasks?.map((task: Task) => (
                <TaskCard key={task.id} task={task} canDelete canUpdate />
              ))}
            </div>
          ) : (
            view === "table" &&
            filteredTasks &&
            filteredTasks?.length > 0 && (
              <div className="w-full">
                <DataGrid
                  rows={filteredTasks || []}
                  columns={taskColumns}
                  checkboxSelection
                  getRowId={(row) => row.id}
                  sx={dataGridSxStyles(isDarkMode)}
                  className={dataGridClassNames}
                />
              </div>
            )
          )}
        </>
      ) : (
        `No ${priority.toLowerCase()} priority tasks for this user`
      )}

      {/* <div>
        {view === "list" && filteredTasks && filteredTasks.length > 0 && (
          <TaskCard task={filteredTasks[0]} canDelete canUpdate />
        )}
        {view === "table" && filteredTasks && filteredTasks.length > 0 && (
          <DataGrid rows={filteredTasks} columns={taskColumns} />
        )}
      </div> */}
    </div>
  );
};
export default ReusablePriorityPage;
