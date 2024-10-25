import { InvitationRequestStatus } from "./initationRequestStatus";

export interface InvitationRequestTypes {
  id: number;
  projectId: string;
  status: InvitationRequestStatus;
  requestedAt: Date;
  inviteCodeId: string;
  projectOwnerId: number;
  userIdRequest: number;
  userName: string;
  userEmail: string;
}
