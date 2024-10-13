import { useGetTasksQuery } from "@/app/state/api";
import React, { useState } from "react";
import Header from "@/components/Header";
import { tailChase } from "ldrs";
import TaskCard from "@/components/PagesComponents/TaskCard";

tailChase.register();

type ListProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: ListProps) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value);
  };

  const filteredTasks = tasks?.filter((task) => {
    return priorityFilter === "" || task.priority === priorityFilter;
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <l-tail-chase size="40" speed="1.75" color="gray" />
      </div>
    );
  }

  if (error) {
    return <div>An error occurred while fetching tasks</div>;
  }

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="flex justify-between pt-5">
        <Header
          name="Abstract List View"
          buttonComponent={
            <button
              className="flex-e flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        >
          <div className="inline-block w-64">
            <select
              value={priorityFilter}
              onChange={handlePriorityChange}
              className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </Header>
      </div>
      <div className="mt-4 grid-cols-1 flex-wrap gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredTasks && filteredTasks.length > 0 ? (
          <div>
            {filteredTasks.map((task) => {
              return <TaskCard key={task.id} task={task} canDelete canUpdate />;
            })}
          </div>
        ) : (
          <div className="dark:text-white">No Tasks Found</div>
        )}
      </div>
    </div>
  );
};

export default ListView;
