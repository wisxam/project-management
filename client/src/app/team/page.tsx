"use client";

import React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { useGetTeamsQuery } from "../state/api";
import Header from "@/components/Header";
import { useAppSelector } from "../redux";

import { dataGridClassNames, dataGridSxStyles } from "../projects/lib/utils";
import TailChaseLoader from "@/components/TailChaseLoader";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Team ID",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "teamName",
    headerName: "Team Name",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "productOwnerUsername",
    headerName: "Product Owner",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "projectManagerUsername",
    headerName: "Product Manager",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
];

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);
const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <TailChaseLoader />
      </div>
    );
  }

  if (isError || !teams) {
    return <div>An error occurred while fetching teams</div>;
  }

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />

      <div style={{ height: 650, width: "100%", overflowX: "auto" }}>
        <div style={{ minWidth: 600 }}>
          <DataGrid
            rows={teams || []}
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
    </div>
  );
};

export default Teams;
