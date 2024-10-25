import { useAppSelector } from "@/app/redux";
import { useDeleteUserProjectRequestMutation } from "@/app/state/api";
import Modal from "@/components/PagesComponents/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
};

const ModalDeleteUserPorjectRequest = ({
  isOpen,
  onClose,
  requestId,
}: Props) => {
  const [deleteRequest, { isLoading }] = useDeleteUserProjectRequestMutation();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const handleDelete = async () => {
    if (!requestId) return;
    try {
      await deleteRequest({
        requestId,
      }).unwrap();
      toast.success("Request deleted successfully", {
        style: {
          backgroundColor: isDarkMode ? "#1D1D1D" : "#DFF6FF",
          color: isDarkMode ? "#DFF6FF" : "#1D1D1D",
        },
        progressStyle: {
          backgroundColor: isDarkMode ? "#DFF6FF" : "#DFF6FF",
        },
      });
    } catch {
      const errorMessage = "Error Deleting request";
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
          Are you sure you want to delete this request? deleting it will result
          in the user sending another request, consider declining if you are not
          sure.
        </p>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Deleting..." : "Delete Task"}
        </button>
      </div>
    </Modal>
  );
};

export default ModalDeleteUserPorjectRequest;
