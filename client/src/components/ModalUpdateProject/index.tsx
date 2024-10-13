import { useUpdateProjectMutation } from "@/app/state/api";
import Modal from "@/components/PagesComponents/Modal";
import { useState } from "react";
import { formatISO } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "@/app/redux";
import { format } from "date-fns";
import { Project } from "@/app/types/projectTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  project?: Project;
}

const ModalUpdateProject = ({ isOpen, onClose, id, project }: Props) => {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const formatDateForInput = (date: string | undefined) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };

  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [startDate, setStartDate] = useState(
    formatDateForInput(project?.startDate),
  );
  const [endDate, setEndDate] = useState(formatDateForInput(project?.endDate));

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleSubmit = async () => {
    if (!name) return;

    const startDateObj = startDate
      ? new Date(`${startDate}T00:00:00`)
      : undefined;
    const endDateObj = endDate ? new Date(`${endDate}T00:00:00`) : undefined;

    const newFormattedStartDate = startDateObj
      ? formatISO(startDateObj, { representation: "complete" })
      : undefined;

    const newFormattedEndDate = endDateObj
      ? formatISO(endDateObj, { representation: "complete" })
      : undefined;

    try {
      const patchedBody = {
        ...(name !== project?.name && { name }),
        ...(description !== project?.description && { description }),
        ...(newFormattedStartDate && { startDate: newFormattedStartDate }),
        ...(newFormattedEndDate && { endDate: newFormattedEndDate }),
      };

      await updateProject({
        projectId: project?.id || -1,
        patchedBody,
      }).unwrap();

      toast.success("Project updated successfully!", {
        style: {
          backgroundColor: isDarkMode ? "#1D1D1D" : "#DFF6FF",
          color: isDarkMode ? "#DFF6FF" : "#1D1D1D",
        },
        progressStyle: {
          backgroundColor: isDarkMode ? "#DFF6FF" : "#DFF6FF",
        },
      });
    } catch (error: any) {
      toast.error("Failed to update project!", {
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
    return name;
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none dark:focus:ring-dark-tertiary";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Update Project">
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
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-green-500 p-3 text-white hover:bg-green-600"
          disabled={isLoading || !isFormValid()}
        >
          Update Project
        </button>
      </form>
    </Modal>
  );
};

export default ModalUpdateProject;
