import { Task } from "./taskTypes";
import { User } from "./userTypes";

export interface Comment {
  id: number;
  text: string;
  taskId: number;
  userId: number;

  task: Task;
  user: User;
}
