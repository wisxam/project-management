import { useState } from "react";
import { Task } from "@/app/types/taskTypes";
import { MessageSquareMore } from "lucide-react";

export default function CommentsHover({ task }: { task: Task }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const numberOfComments = task.comments?.length || 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <button className="flex">
        <MessageSquareMore size={20} />
        <span className="ml-1 text-sm dark:text-neutral-400">
          {numberOfComments}
        </span>
      </button>
      {isTooltipVisible && (
        <div className="absolute bottom-6 right-full z-50 h-auto w-64 overflow-auto rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-bold">Comments</h2>
          <div className="space-y-4">
            {task.comments?.length && numberOfComments > 0
              ? task.comments.map((comments) => (
                  <div key={comments.text}>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {comments.user.username}
                        </span>
                        <span className="font-semibold">{comments.text}</span>
                        <span className="text-xs text-gray-500 dark:text-neutral-500"></span>
                      </div>
                    </div>
                  </div>
                ))
              : "No comments yet."}
          </div>
        </div>
      )}
    </div>
  );
}
