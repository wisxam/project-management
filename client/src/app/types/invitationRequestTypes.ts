import { InitationRequestStatus } from "./initationRequestStatus";

export interface InvitationRequestTypes {
  id: number;
  projectId: string;
  status: InitationRequestStatus;
  requestedAt: Date;
  inviteCodeId: string;
  projectOwnerId: number;
  userIdRequest: number;
  userName: string;
  userEmail: string;
}
