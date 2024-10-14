import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/app/types/priorityTypes";

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.BackLog} />;
};

export default Urgent;
