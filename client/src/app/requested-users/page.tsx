"use client";

import React from "react";
import { useGetInvitationRequestsByOwnerQuery } from "../state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "../projects/lib/utils";
import { useAppSelector } from "../redux";
import TailChaseLoader from "@/components/TailChaseLoader";
import Header from "@/components/Header";

const requestedUsersColoumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 60,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "userName",
    headerName: "User Name",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "userEmail",
    headerName: "User Email",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "requestedAt",
    headerName: "Requested At",
    width: 170,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "projectId",
    headerName: "Project ID",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
];

const RequestedUsers = () => {
  const {
    data: invitationRequests,
    error,
    isLoading: invitationLoading,
  } = useGetInvitationRequestsByOwnerQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (invitationLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <TailChaseLoader />
      </div>
    );
  if (error) return <p>Error loading invitation requests</p>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Requested Users" />
      <div style={{ height: 650, width: "100%", overflowX: "auto" }}>
        <div style={{ minWidth: 600 }}>
          <DataGrid
            rows={invitationRequests || []}
            columns={requestedUsersColoumns}
            loading={
              invitationLoading ?? (
                <div className="flex h-full items-center justify-center">
                  <TailChaseLoader />
                </div>
              )
            }
            getRowClassName={() => "data-grid-row"}
            getCellClassName={() => "data-grid-cell"}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestedUsers;
