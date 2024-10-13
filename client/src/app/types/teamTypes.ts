import { Project } from "./projectTypes";
import { User } from "./userTypes";

export interface Team {
  id: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
  projectTeams: Project[];
  user: User[];
}
