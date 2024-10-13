import { Task } from "@/app/types/taskTypes";
import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { PriorityTag } from "@/app/projects/BoardView";
import { PencilLineIcon, Trash } from "lucide-react";
import ModalDeleteTask from "../ModalDeleteTask";
import ModalUpdateTask from "../ModalUpdateTask";

type Props = {
  task: Task;
  canDelete?: boolean;
  canUpdate?: boolean;
};

const TaskCard = ({ task, canDelete, canUpdate }: Props) => {
  const [isModalDeleteTaskOpen, setIsModalDeleteTaskOpen] = useState(false);
  const [isModalUpdateTaskOpen, setIsModalUpdateTaskOpen] = useState(false);

  const startDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "N/A";

  const dueDate = task.dueDate ? format(new Date(task.dueDate), "P") : "N/A";

  return (
    <div className="relative mb-3 flex flex-col rounded-md bg-slate-100 p-4 pt-14 shadow-md dark:bg-stroke-dark dark:text-white md:flex-row md:justify-between md:pt-4">
      <div className="flex w-full flex-col gap-2 md:w-auto">
        <div className="w-fit pb-2">
          {task.priority && <PriorityTag priority={task.priority} />}
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-white">
          <strong>Task Name:</strong> {task.title}
        </p>
        {task?.attachments && task.attachments.length > 0 && (
          <div>
            <strong>Attachments:</strong>
            <div className="flex flex-wrap">
              <Image
                src={`/${task.attachments[0].fileURL}`}
                alt={task.attachments[0].fileName}
                width={400}
                height={200}
                className="rounded-md"
              />
            </div>
          </div>
        )}
        <p>
          <strong>Title:</strong> {task.title}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {task.description || "No description provided"}
        </p>
        <p>
          <strong>Status:</strong> {task.status}
        </p>
        <p>
          <strong>Start Date:</strong> {startDate}
        </p>
        <p>
          <strong>End Date:</strong> {dueDate}
        </p>
        <p>
          <strong>Author:</strong>{" "}
          {task.author ? task?.author?.username : "Unknown"}
        </p>
        <p>
          <strong>Assignee:</strong>{" "}
          {task.assignee ? task.assignee.username : "Unassigned"}
        </p>
      </div>

      {canDelete && (
        <div className="flex">
          <button
            className="-opacity-50 absolute right-0 top-0 flex h-12 w-52 items-center justify-center overflow-hidden bg-slate-500 bg-opacity-70 p-4 text-white transition duration-200 ease-in-out hover:bg-red-950 hover:bg-opacity-90 hover:shadow-lg focus:outline-none dark:bg-dark-tertiary dark:hover:bg-red-950 md:h-full"
            onClick={() => setIsModalDeleteTaskOpen(true)}
          >
            <Trash className="h-8 w-8" />
            <span className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 transition duration-500 hover:opacity-100"></span>
          </button>
        </div>
      )}

      {canUpdate && (
        <div className="flex">
          <button
            className="-opacity-50 absolute right-52 top-0 flex h-12 w-52 items-center justify-center overflow-hidden bg-slate-500 bg-opacity-70 p-4 text-white transition duration-200 ease-in-out hover:bg-green-950 hover:bg-opacity-90 hover:shadow-lg focus:outline-none dark:bg-dark-tertiary dark:hover:bg-green-950 md:h-full"
            onClick={() => setIsModalUpdateTaskOpen(true)}
          >
            <PencilLineIcon className="h-8 w-8" />
            <span className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 transition duration-500 hover:opacity-100"></span>
          </button>
        </div>
      )}
      <ModalDeleteTask
        isOpen={isModalDeleteTaskOpen}
        onClose={() => setIsModalDeleteTaskOpen(false)}
        taskId={task.id}
      />
      <ModalUpdateTask
        isOpen={isModalUpdateTaskOpen}
        onClose={() => setIsModalUpdateTaskOpen(false)}
        id={String(task.id)}
        task={task}
      />
    </div>
  );
};

export default TaskCard;
