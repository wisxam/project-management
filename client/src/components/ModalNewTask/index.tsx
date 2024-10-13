import { useCreateTaskMutation } from "@/app/state/api";
import Modal from "@/components/PagesComponents/Modal";
import { useState } from "react";
import { format, formatISO } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Status } from "@/app/types/statusTypes";
import { Priority } from "@/app/types/priorityTypes";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/app/state";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const formatDateForInput = (date: string | undefined) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };

  const dispatch = useAppDispatch();
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.None);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [points, setPoints] = useState("");
  const [projectId, setProjectId] = useState("");

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
    if (!title || !authorUserId || !(id !== null || projectId)) return;

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
      await createTask({
        title,
        description,
        status,
        priority,
        tags,
        startDate: newFormattedStartDate,
        dueDate: newFormattedDueDate,
        authorUserId: parseInt(authorUserId),
        assignedUserId: parseInt(assignedUserId),
        points: parseInt(points),
        projectId: id === null ? Number(projectId) : Number(id),
      }).unwrap();
      sideBarCollapse();
      toast.success("Task created successfully!", {
        style: {
          backgroundColor: isDarkMode ? "#1D1D1D" : "#DFF6FF",
          color: isDarkMode ? "#DFF6FF" : "#1D1D1D",
        },
        progressStyle: {
          backgroundColor: isDarkMode ? "#DFF6FF" : "#DFF6FF",
        },
      });
      resetForm();
    } catch (error: any) {
      const errorMessage = "Failed to create task!";
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
    return title && authorUserId && !(id !== null || projectId);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus(Status.ToDo);
    setPriority(Priority.None);
    setTags("");
    setStartDate("");
    setDueDate("");
    setAuthorUserId("");
    setAssignedUserId("");
    setPoints("");
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus-outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none dark:focus:ring-dark-tertiary";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      name="Create New Task"
    >
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {!title && <span className="text-red-500">Title is required</span>}
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
            <option value="">Select Status</option>
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
            <option value="">Select Priority</option>
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="date"
            className={inputStyles}
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
        {!authorUserId && (
          <span className="text-red-500">Author user is required</span>
        )}
        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
          disabled={isLoading}
        />
        {id === null && (
          <input
            type="text"
            className={inputStyles}
            placeholder="ProjectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
