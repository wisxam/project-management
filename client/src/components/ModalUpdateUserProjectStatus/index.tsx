import { useUpdateUserProjectAccessMutation } from "@/app/state/api";
import Modal from "@/components/PagesComponents/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "@/app/redux";
import { InvitationRequestStatus } from "@/app/types/initationRequestStatus";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  currentStatus: InvitationRequestStatus;
};

const ModalUpdateUserProjectStatus = ({
  isOpen,
  onClose,
  requestId,
  currentStatus,
}: Props) => {
  const [updateUserStatus, { isLoading }] =
    useUpdateUserProjectAccessMutation();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateUserStatus({ requestId, status: currentStatus }).unwrap();

      toast.success("User project status updated successfully!", {
        style: {
          backgroundColor: isDarkMode ? "#1D1D1D" : "#DFF6FF",
          color: isDarkMode ? "#DFF6FF" : "#1D1D1D",
        },
        progressStyle: {
          backgroundColor: isDarkMode ? "#DFF6FF" : "#DFF6FF",
        },
      });
      onClose();
    } catch {
      const errorMessage = "Failed to update user project status!";
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Update User Project Status">
      <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
        <label
          htmlFor="status"
          className="text-[15px] font-medium dark:text-white"
        >
          Status: {currentStatus}
        </label>
        <button
          type="submit"
          className={`w-full rounded bg-green-500 p-3 text-white ${
            isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-green-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Status"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalUpdateUserProjectStatus;
