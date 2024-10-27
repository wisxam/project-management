"use client";

import React, { useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useAppSelector } from "@/app/redux";
import { useGetProjectsQuery, useGetTasksQuery } from "@/app/state/api";
import Header from "@/components/Header";
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/app/projects/lib/utils";
import { Task } from "@/app/types/taskTypes";
import { Priority } from "@/app/types/priorityTypes";
import { Status } from "@/app/types/statusTypes";
import ModalDeleteTask from "@/components/ModalDeleteTask";
import TailChaseLoader from "@/components/TailChaseLoader";

type Props = {
  params: { id: number };
};

const taskColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Homepage = ({ params }: Props) => {
  const { id } = params;

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsQuery();

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: id });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [isModalDeleteTaskOpen, setIsModalDeleteTaskOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <TailChaseLoader />
      </div>
    );
  }

  if (tasksError || projectsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1>Error fetching tasks and projects</h1>
      </div>
    );
  }

  if (!projects || !tasks) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1>No tasks or projects yet, make sure to make one</h1>
      </div>
    );
  }

  const priorityCount = tasks?.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((priority) => ({
    name: priority,
    count: priorityCount[priority],
  }));

  const statusCount = tasks?.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { status } = task;
      acc[status as Status] = (acc[status as Status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((status) => ({
    name: status,
    count: statusCount[status],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82CA9D",
        text: "#000000",
      };

  return (
    <div className="container mx-auto h-full p-4">
      <Header name="Project Management Dashboard" />

      {/* First Row: Task Priority and Task Status Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Tasks Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} label>
                {projectStatus?.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row: Tasks Data Grid */}
      <div className="mt-4 rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">
          Your Tasks
        </h3>

        {selectedRows.length > 0 && (
          <div className="mb-4 text-center md:text-left">
            <button
              className="rounded bg-red-500 px-4 py-2 text-white"
              onClick={() => setIsModalDeleteTaskOpen(true)}
            >
              Delete Selected Tasks
            </button>
          </div>
        )}

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={tasks || []}
            columns={taskColumns}
            checkboxSelection
            loading={tasksLoading}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRows(newSelectionModel);
            }}
            getRowClassName={() => "data-grid-row"}
            getCellClassName={() => "data-grid-cell"}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      </div>

      <ModalDeleteTask
        isOpen={isModalDeleteTaskOpen}
        onClose={() => setIsModalDeleteTaskOpen(false)}
        taskId={selectedRows as number[]}
        projectId={String(
          tasks?.find((task) => task.id === selectedRows[0])?.projectId,
        )}
      />
    </div>
  );
};

export default Homepage;
