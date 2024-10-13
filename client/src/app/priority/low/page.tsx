import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/app/types/priorityTypes";

type Props = {};

const Urgent = (props: Props) => {
  return <ReusablePriorityPage priority={Priority.Low} />;
};

export default Urgent;
