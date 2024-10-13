type Props = {
  message: string;
  onClose: () => void;
};

const Toast = ({ message, onClose }: Props) => {
  return (
    <div className="fixed bottom-4 left-4 rounded bg-green-500 p-3 text-white shadow-lg">
      <p>{message}</p>
      <button onClick={onClose} className="ml-2 font-bold text-white">
        X
      </button>
    </div>
  );
};

export default Toast;
