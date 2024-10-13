import { useUpdateTaskMutation } from "@/app/state/api";
import Modal from "@/components/PagesComponents/Modal";
import { useState, useEffect } from "react";
import { formatISO } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Status } from "@/app/types/statusTypes";
import { Priority } from "@/app/types/priorityTypes";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/app/state";
import { Task } from "@/app/types/taskTypes";
import { format } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  task: Task;
};

const ModalUpdateTask = ({ isOpen, onClose, id, task }: Props) => {
  const dispatch = useAppDispatch();
  const [updateTask, { isLoading }] = useUpdateTaskMutation({
    fixedCacheKey: id,
  });
  const formatDateForInput = (date: string | undefined) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<Status>(task?.status || Status.ToDo);
  const [priority, setPriority] = useState<Priority>(
    task?.priority || Priority.None,
  );
  const [tags, setTags] = useState(task?.tags || "");

  const [startDate, setStartDate] = useState(
    formatDateForInput(task?.startDate),
  );
  const [dueDate, setDueDate] = useState(formatDateForInput(task?.dueDate));

  const [authorUserId, setAuthorUserId] = useState(task?.authorUserId || "");
  const [assignedUserId, setAssignedUserId] = useState(
    task?.assignedUserId || "",
  );
  const [points, setPoints] = useState(task?.points || "");

  const isSideBarCollaped = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const sideBarCollapse = () => {
    if (!isSideBarCollaped) {
      dispatch(setIsSidebarCollapsed(true));
    }
  };

  const handleSubmit = async () => {
    if (!title || !authorUserId) return;

    const startDateObj = startDate
      ? new Date(`${startDate}T00:00:00`)
      : undefined;

    const dueDateObj = dueDate ? new Date(`${dueDate}T00:00:00`) : undefined;

    const newFormattedStartDate = startDateObj
      ? formatISO(startDateObj, { representation: "complete" })
      : undefined;

    const newFormattedDueDate = dueDateObj
      ? formatISO(dueDateObj, { representation: "complete" })
      : undefined;

    try {
      const patchedBody = {
        ...(title !== task.title && { title }),
        ...(description !== task.description && { description }),
        ...(status !== task.status && { status }),
        ...(priority !== task.priority && { priority }),
        ...(tags !== task.tags && { tags }),
        ...(newFormattedStartDate && { startDate: newFormattedStartDate }),
        ...(newFormattedDueDate && { dueDate: newFormattedDueDate }),
        ...(authorUserId !== task.authorUserId && {
          authorUserId: Number(authorUserId),
        }),
        ...(assignedUserId !== task.assignedUserId && {
          assignedUserId: Number(assignedUserId),
        }),
        ...(points !== task.points && { points: Number(points) }),
      };

      await updateTask({
        taskId: id,
        patchedBody,
        projectId: Number(task.projectId),
      }).unwrap();
      sideBarCollapse();
      toast.success("Task updated successfully!", {
        style: {
          backgroundColor: isDarkMode ? "#1D1D1D" : "#DFF6FF",
          color: isDarkMode ? "#DFF6FF" : "#1D1D1D",
        },
        progressStyle: {
          backgroundColor: isDarkMode ? "#DFF6FF" : "#DFF6FF",
        },
      });
    } catch (error: any) {
      const errorMessage = "Failed to update task!";
      toast.error(errorMessage, {
        style: {
          backgroundColor: isDarkMode ? "#6A2C2C" : "#7F3B3B",
          color: isDarkMode ? "#EBEBEB" : "#FFFFFF",
        },
        progressStyle: {
          backgroundColor: isDarkMode ? "#FFFFFF" : "#000000",
        },
      });
    }
  };

  const isFormValid = () => {
    return title;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus-outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none dark:focus:ring-dark-tertiary";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      name="Update Task"
    >
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            disabled={isLoading}
          >
            <option value={Status.ToDo}>{Status.ToDo}</option>
            <option value={Status.WorkInProgress}>
              {Status.WorkInProgress}
            </option>
            <option value={Status.UnderReview}>{Status.UnderReview}</option>
            <option value={Status.Completed}>{Status.Completed}</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            disabled={isLoading}
          >
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.BackLog}>Backlog</option>
          </select>
        </div>
        <input
          type="number"
          className={inputStyles}
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isLoading}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="date"
            className={inputStyles}
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Author User ID"
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="w-full rounded bg-green-500 p-3 text-white hover:bg-green-600"
          disabled={isLoading || !isFormValid()}
        >
          Update Task
        </button>
      </form>
    </Modal>
  );
};

export default ModalUpdateTask;
