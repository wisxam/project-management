"use client";

import { useState, useEffect } from "react";
import ProjectHeader from "../projectHeader";
import Board from "../BoardView";
import List from "../ListView";
import { useAppSelector } from "@/app/redux";
import Timeline from "../TimelineView";
import Tableview from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";

type Props = {
  params: { id: string };
};

const Project = ({ params }: Props) => {
  const headerNameDefined = useAppSelector(
    (state) => state.global.isHeaderNameDefined,
  );
  const { id } = params;

  const [activeTab, setActiveTab] = useState(headerNameDefined);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  useEffect(() => {
    setActiveTab(headerNameDefined || "Board");
  }, [headerNameDefined]);

  return (
    <div>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Board" ? (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      ) : activeTab === "List" ? (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      ) : activeTab === "Timeline" ? (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      ) : (
        <Tableview id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default Project;
