import { useAppSelector } from "@/app/redux";
import { useDeleteProjectMutation } from "@/app/state/api";
import Modal from "@/components/PagesComponents/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
};

const ModalDeleteProject = ({ isOpen, onClose, projectId }: Props) => {
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const handleDelete = async () => {
    if (!projectId) return;
    try {
      await deleteProject(projectId).unwrap();
      toast.success("Project Deleted Successfully", {
        style: {
          backgroundColor: isDarkMode ? "#1D1D1D" : "#DFF6FF",
          color: isDarkMode ? "#DFF6FF" : "#1D1D1D",
        },
        progressStyle: {
          backgroundColor: isDarkMode ? "#DFF6FF" : "#DFF6FF",
        },
      });
    } catch (error: unknown) {
      const errorMessage = "Error Deleting Project";
      toast.error(errorMessage, {
        style: {
          backgroundColor: isDarkMode ? "#6A2C2C" : "#7F3B3B",
          color: isDarkMode ? "#EBEBEB" : "#FFFFFF",
        },
        progressStyle: {
          backgroundColor: isDarkMode ? "#FFFFFF" : "#000000",
        },
      });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Delete task">
      <div className="mt-4 space-y-6">
        <p className="text-xl dark:text-white">
          Are you sure you want to delete this task?
        </p>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Deleting..." : "Delete Project"}
        </button>
      </div>
    </Modal>
  );
};

export default ModalDeleteProject;
