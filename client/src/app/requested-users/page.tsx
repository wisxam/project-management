"use client";

import React, { useState } from "react";
import { useGetInvitationRequestsByOwnerQuery } from "../state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "../projects/lib/utils";
import { useAppSelector } from "../redux";
import TailChaseLoader from "@/components/TailChaseLoader";
import Header from "@/components/Header";
import { format } from "date-fns";
import { CheckCircle2Icon, Clock2Icon, XCircleIcon } from "lucide-react";
import ModalUpdateUserProjectStatus from "@/components/ModalUpdateUserProjectStatus";
import { InvitationRequestStatus } from "../types/initationRequestStatus";
import ModalDeleteUserPorjectRequest from "@/components/ModalDeleteUserPorjectRequest";

const RequestedUsers = () => {
  const {
    data: invitationRequests,
    error,
    isLoading: invitationLoading,
  } = useGetInvitationRequestsByOwnerQuery();

  const [requestId, setRequestId] = useState<number>(0);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<InvitationRequestStatus>(
    InvitationRequestStatus.default,
  );

  const requestedUsersColumns: GridColDef[] = [
    {
      field: "userName",
      headerName: "User Name",
      width: 150,
      align: "center",
      headerAlign: "center",
      minWidth: 120,
    },
    {
      field: "userEmail",
      headerName: "User Email",
      width: 150,
      align: "center",
      headerAlign: "center",
      minWidth: 140,
    },
    {
      field: "requestedAt",
      headerName: "Requested At",
      width: 170,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          {params.row.requestedAt
            ? format(new Date(params.row.requestedAt), "dd-MM-yyyy")
            : "N/A"}
        </div>
      ),
      minWidth: 120,
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
      renderCell: (params) => (
        <div className="flex h-full items-center justify-center">
          {params.row.status === InvitationRequestStatus.pending ? (
            <Clock2Icon />
          ) : params.row.status === InvitationRequestStatus.accepted ? (
            <CheckCircle2Icon />
          ) : (
            <XCircleIcon />
          )}
        </div>
      ),
    },
    {
      field: "accept",
      headerName: "Accept",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          {params.row.status === InvitationRequestStatus.accepted ? (
            <button
              onClick={() => {
                setRequestId(params.row.id);
                setCurrentStatus(InvitationRequestStatus.pending);
                setIsStatusModalOpen(true);
              }}
              className="flex h-10 w-32 items-center justify-center rounded-full bg-slate-600 text-xs text-white hover:bg-slate-700"
            >
              Remove privilege
            </button>
          ) : (
            <button
              onClick={() => {
                setRequestId(params.row.id);
                setCurrentStatus(InvitationRequestStatus.accepted);
                setIsStatusModalOpen(true);
              }}
              disabled={params.row.status === "denied"}
              className={`flex h-10 w-32 items-center justify-center rounded-full ${
                params.row.status === "denied"
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              Accept
            </button>
          )}
        </div>
      ),
      minWidth: 120,
    },
    {
      field: "decline",
      headerName: "Decline",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          {params.row.status === InvitationRequestStatus.accepted ? (
            "User already added"
          ) : params.row.status === InvitationRequestStatus.denied ? (
            <button
              onClick={() => {
                setRequestId(params.row.id);
                setCurrentStatus(InvitationRequestStatus.pending);
                setIsStatusModalOpen(true);
              }}
              className="flex h-10 w-32 items-center justify-center rounded-full bg-orange-600 text-[11px] text-white hover:bg-orange-700"
            >
              Remove declination
            </button>
          ) : (
            <button
              onClick={() => {
                setRequestId(params.row.id);
                setCurrentStatus(InvitationRequestStatus.denied);
                setIsStatusModalOpen(true);
              }}
              className="flex h-10 w-32 items-center justify-center rounded-full bg-orange-600 text-white hover:bg-orange-700"
            >
              Decline
            </button>
          )}
        </div>
      ),
      minWidth: 130,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          <button
            onClick={() => {
              setRequestId(params.row.id);
              setIsDeleteModalOpen(true);
            }}
            className="flex h-10 w-32 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
      minWidth: 90,
    },
  ];

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
      {invitationRequests && invitationRequests.length > 0 ? (
        <>
          <div style={{ height: 650, width: "100%", overflowX: "auto" }}>
            <div style={{ minWidth: 600 }}>
              <DataGrid
                rows={invitationRequests || []}
                columns={requestedUsersColumns}
                loading={invitationLoading}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-cell"}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
              />
            </div>
          </div>
          <ModalUpdateUserProjectStatus
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            requestId={requestId}
            currentStatus={currentStatus}
          />
          <ModalDeleteUserPorjectRequest
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            requestId={requestId}
          />
        </>
      ) : (
        <p className="flex items-center justify-center">
          You do not have requests for any projects yet, consider sharing your
          project generated code with your colleagues.
        </p>
      )}
    </div>
  );
};

export default RequestedUsers;
