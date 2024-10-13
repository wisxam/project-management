import { Project } from "@/app/types/projectTypes";
import React from "react";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="flex max-h-[300px] min-h-[210px] flex-col gap-5 rounded border border-stone-400 p-4 font-bold shadow-sm transition-shadow duration-200 hover:border-stone-700 dark:border-dark-tertiary dark:bg-dark-secondary dark:text-white dark:hover:border-[#ffebb7] dark:hover:border-opacity-20 dark:hover:shadow-slate-500">
      <h4 className="flex justify-center underline">
        Project ID: {project.id}
      </h4>
      <h3>Project Name: {project.name}</h3>
      <p>Project Description: {project.description}</p>
      <p>Start Date: {project.startDate}</p>
      <p>End Date: {project.endDate}</p>
    </div>
  );
};

export default ProjectCard;
