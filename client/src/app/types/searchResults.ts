import { Project } from "./projectTypes";
import { Task } from "./taskTypes";
import { User } from "./userTypes";

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}
