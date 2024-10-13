import { Attachment } from "./attachmentTypes";
import { Comment } from "./commentsTypes";
import { Priority } from "./priorityTypes";
import { Status } from "./statusTypes";
import { User } from "./userTypes";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId?: number;
  authorUserId?: number;
  assignedUserId?: number;

  // Not in datamodel of tasks in prisma schema data but fetched from other tables using foreign keys
  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

// import { Attachment } from "./attachmentTypes";
// import { Comment } from "./commentsTypes";
// import { Priority } from "./priorityTypes";
// import { Status } from "./statusTypes";
// import { User } from "./userTypes";

// export interface TaskData {
//   id: number;
//   title: string;
//   description?: string;
//   status?: Status;
//   priority?: Priority;
//   tags?: string;
//   startDate?: string;
//   dueDate?: string;
//   points?: number;
//   projectId?: number;
//   authorUserId?: number;
//   assignedUserId?: number;
//   author?: User;
//   assignee?: User;
//   comments?: Comment[];
//   attachments?: Attachment[];
// }

// export class Task {
//   public id: number;
//   public title: string;
//   public description?: string;
//   public status?: Status;
//   public priority?: Priority;
//   public tags?: string;
//   public startDate?: string;
//   public dueDate?: string;
//   public points?: number;
//   public projectId?: number;
//   public authorUserId?: number;
//   public assignedUserId?: number;

//   // Not in datamodel of tasks in prisma schema data but fetched from other tables using foreign keys
//   public author?: User;
//   public assignee?: User;
//   public comments?: Comment[];
//   public attachments?: Attachment[];

//   constructor(data: TaskData) {
//     this.id = data.id;
//     this.title = data.title;
//     this.description = data.description || "";
//     this.status = data.status;
//     this.priority = data.priority;
//     this.tags = data.tags || "";
//     this.startDate = data.startDate || "";
//     this.dueDate = data.dueDate || "";
//     this.points = data.points || undefined;
//     this.projectId = data.projectId || undefined;
//     this.authorUserId = data.authorUserId || undefined;
//     this.assignedUserId = data.assignedUserId || undefined;

//     this.author = data.author;
//     this.assignee = data.assignee;
//     this.comments = data.comments || [];
//     this.attachments = data.attachments || [];
//   }
//   convertStartDate(): string | null {
//     return this.startDate
//       ? new Date(this.startDate).toISOString().split("T")[0]
//       : null;
//   }
// }
