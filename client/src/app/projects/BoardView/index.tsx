import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/app/state/api";
import {
  DndProvider,
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { useEffect, useRef, useState } from "react";
import { Task as TaskType } from "@/app/types/taskTypes";
import { zoomies } from "ldrs";
import { EllipsisVertical, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import CommentsModal from "@/components/PagesComponents/CommentsModal";
import { Priority } from "@/app/types/priorityTypes";
import ModalDeleteTask from "@/components/ModalDeleteTask";
import ModalUpdateTask from "@/components/ModalUpdateTask";

zoomies.register();

type BoardProps = {
  id: string; // As it's provided from url
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) }); // Pass in the project id as number

  const [updateTaskStatus] = useUpdateTaskStatusMutation({}); // The updateTaskStatus is just a name that will be used to trigger the api fucntion of useUpdateTaskStatusMutation()

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus }); // Since taskId in useUpdateTaskStatusMutation() is the same name as taskId prop in moveTask then no need to taskId: taskId
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <l-zoomies size="40" speed="1.75" color="gray" />
      </div>
    );
  }

  if (error) {
    return <div>An error occurred while fetching tasks</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => {
          return (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks || []}
              moveTask={moveTask}
              setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            />
          );
        })}
      </div>
    </DndProvider>
  ); // Use the drag n drop provider React dnd
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const taskCount = tasks.filter((task) => task.status === status).length;

  const statusColor: Record<string, string> = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-lg p-6 py-2 sm:py-4 xl:px-2 ${isOver && "bg-blue-100 dark:bg-neutral-950"} h-auto`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 rounded-s-lg !bg-[${statusColor[status]}]`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}
            <span className="ml-2 inline-block h-[1.5rem] w-[1.5rem] rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary">
              {taskCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => {
                setIsModalNewTaskOpen(true);
              }}
            >
              <PlusIcon size={16} />
            </button>
          </div>
        </div>
      </div>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={`${status}-${task.id}`} task={task} moveTask={moveTask} />
        ))}
    </div>
  );
};
type TaskProps = {
  task: TaskType;
  moveTask: (taskId: number, toStatus: string) => void;
};

const Task = ({ task }: TaskProps) => {
  const [isAdjustingTabOpened, setisAdjustingTabOpened] = useState(false);
  const deleteTabRef = useRef<HTMLDivElement | null>(null);
  const [isModalDeleteTaskOpen, setIsModalDeleteTaskOpen] = useState(false);

  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleOpenUpdateModal = (taskId: number) => {
    setActiveTaskId(taskId);
    setIsUpdateModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        deleteTabRef.current &&
        !deleteTabRef.current.contains(event.target as Node)
      ) {
        setisAdjustingTabOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";

  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-6 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center gap-1">
            <button
              className="flex h-6 w-5 items-center justify-center dark:text-neutral-500"
              onClick={() => setisAdjustingTabOpened(true)}
            >
              <EllipsisVertical size={26} />
            </button>
            {isAdjustingTabOpened && (
              <div
                ref={deleteTabRef}
                className="absolute right-2 top-full z-50 w-48 rounded-lg bg-white p-2 shadow-lg dark:bg-dark-secondary"
              >
                <div className="flex flex-col space-y-2">
                  <button
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-dark-tertiary"
                    onClick={() => {
                      setisAdjustingTabOpened(false);
                      handleOpenUpdateModal(task.id);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-dark-tertiary"
                    onClick={() => {
                      setisAdjustingTabOpened(false);
                      setIsModalDeleteTaskOpen(true);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-dark-tertiary"
                    onClick={() => {
                      setisAdjustingTabOpened(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="relative right-1 text-xs font-semibold dark:text-white">
              {task.status !== "Completed" ? (
                task.points + " points"
              ) : (
                <span className="text-green-700">The task is completed!</span>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-300 pt-5 dark:border-stroke-dark">
          <div className="text-xs text-gray-500 dark:text-neutral-500">
            <div>
              Start: {formattedStartDate && <span>{formattedStartDate} </span>}
            </div>
            <div>
              Due: {formattedDueDate && <span>{formattedDueDate}</span>}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex -space-x-[6px] overflow-hidden">
                {task.assignee && (
                  <Image
                    key={`assignee-${task.assignee.userId}`}
                    src={`/${task.assignee.profilePictureUrl}`}
                    alt={task.assignee.username}
                    width={30}
                    height={30}
                    className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                  />
                )}
                {task.author && (
                  <Image
                    key={`author-${task.author.userId}`}
                    src={`/${task.author.profilePictureUrl}`}
                    alt={task.author.username}
                    width={30}
                    height={30}
                    className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                  />
                )}
              </div>
              <div className="flex items-center text-gray-500 dark:text-neutral-500">
                <CommentsModal task={task} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalDeleteTask
        isOpen={isModalDeleteTaskOpen}
        onClose={() => setIsModalDeleteTaskOpen(false)}
        taskId={task.id}
      />
      <ModalUpdateTask
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        id={String(task.id)}
        task={task}
      />
    </div>
  );
};
export const PriorityTag = ({ priority }: { priority: Priority }) => {
  return (
    <div
      className={`rounded-full px-2 py-1 text-sm font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "Medium"
              ? "bg-green-200 text-green-700"
              : priority === "Low"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );
};

export default BoardView;
