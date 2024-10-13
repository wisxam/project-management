"use client";

import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useGetProjectsQuery } from "../state/api";
import { tailChase } from "ldrs";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "../projects/lib/utils";
import { useAppSelector } from "../redux";
import ModalNewProject from "../projects/ModalNewProject";
import { format } from "date-fns";
import ModalUpdateProject from "@/components/ModalUpdateProject";
import ModalDeleteProject from "@/components/ModalDeleteProject";

tailChase.register();

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const HomePageSelector = () => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [isModalDeleteProjectOpen, setIsModalDeleteProjectOpen] =
    useState(false);
  const [isModalUpdateProjectOpen, setIsModalUpdateProjectOpen] =
    useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Project ID",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Project Name",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Project Description",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          {params.row.startDate
            ? format(new Date(params.row.startDate), "yyyy-MM-dd")
            : "N/A"}
        </div>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          {params.row.endDate
            ? format(new Date(params.row.endDate), "yyyy-MM-dd")
            : "N/A"}
        </div>
      ),
    },
    {
      field: "projectAnalysis",
      headerName: "Project Analysis",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          <button
            onClick={() => {
              navigateToHomepage(params.row.id);
            }}
            className="flex h-10 w-32 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700"
          >
            Analyze
          </button>
        </div>
      ),
    },
    {
      field: "updateProject",
      headerName: "Update Project",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          <button
            onClick={() => {
              setSelectedProjectId(params.row.id);
              setIsModalUpdateProjectOpen(true);
            }}
            className="flex h-10 w-32 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            Update
          </button>
        </div>
      ),
    },
    {
      field: "deleteProject",
      headerName: "Delete Project",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          <button
            onClick={() => {
              setSelectedProjectId(params.row.id);
              setIsModalDeleteProjectOpen(true);
            }}
            className="flex h-10 w-32 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const router = useRouter();

  const navigateToHomepage = (id: number) => {
    router.push(`/home/${id}`);
  };

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <l-tail-chase size="40" speed="1.75" color="gray" />
      </div>
    );
  }

  if (isError) {
    return <div>An error occurred while fetching projects</div>;
  }

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Select Project" />
      {projects && projects?.length > 0 ? (
        <div style={{ height: 650, width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: 600 }}>
            <DataGrid
              rows={projects || []}
              columns={columns}
              getRowId={(row) => row.id}
              pagination
              className={dataGridClassNames}
              slots={{
                toolbar: CustomToolbar,
              }}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsModalNewProjectOpen(true)}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Create New Project
        </button>
      )}

      {isModalNewProjectOpen && (
        <ModalNewProject
          isOpen={isModalNewProjectOpen}
          onClose={() => setIsModalNewProjectOpen(false)}
        />
      )}

      {isModalUpdateProjectOpen && selectedProjectId && (
        <ModalUpdateProject
          isOpen={isModalUpdateProjectOpen}
          onClose={() => setIsModalUpdateProjectOpen(false)}
          id={String(selectedProjectId)}
          project={projects?.find((p) => p.id === selectedProjectId)}
        />
      )}

      {isModalDeleteProjectOpen && selectedProjectId && (
        <ModalDeleteProject
          isOpen={isModalDeleteProjectOpen}
          onClose={() => setIsModalDeleteProjectOpen(false)}
          projectId={Number(selectedProjectId)}
        />
      )}
    </div>
  );
};

export default HomePageSelector;
