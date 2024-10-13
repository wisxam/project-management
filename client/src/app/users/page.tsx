"use client";

import React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { useGetUsersQuery } from "../state/api";
import Header from "@/components/Header";
import { useAppSelector } from "../redux";
import { tailChase } from "ldrs";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "../projects/lib/utils";

tailChase.register();

const columns: GridColDef[] = [
  {
    field: "userId",
    headerName: "ID",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  { field: "username", headerName: "User Name", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          <Image
            src={`/${params.value}`}
            alt={`${params.row.username}`}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
      </div>
    ),
    align: "center",
    headerAlign: "center",
  },
  {
    field: "teamId",
    headerName: "Team ID",
    width: 100,
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
const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <l-tail-chase size="40" speed="1.75" color="gray" />
      </div>
    );
  }

  if (isError || !users) {
    return <div>An error occurred while fetching users</div>;
  }

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />

      <div style={{ height: 650, width: "100%", overflowX: "auto" }}>
        <div style={{ minWidth: 600 }}>
          <DataGrid
            rows={users || []}
            columns={columns}
            getRowId={(row) => row.userId}
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

export default Users;
