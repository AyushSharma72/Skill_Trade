"use client";
import React from "react";
import { Tabs } from "antd";
import AssignedRequest from "./_Components/AssignedRequest";
import AcceptedRequest from "./_Components/AcceptedRequest";
import CompletedRequest from "./_Components/CompletedRequest";
import { FaCheck } from "react-icons/fa";
import { MdAssignmentInd, MdIncompleteCircle } from "react-icons/md";

const WorkerRequests = () => {
  const items = [
    {
      key: "1",
      label: "Accepted request",
      children: <AcceptedRequest />,
      icon: <FaCheck />,
    },
    {
      key: "2",
      label: "Assigned Request",
      children: <AssignedRequest />,
      icon: <MdAssignmentInd />,
    },
    {
      key: "3",
      label: "Completed Request",
      children: <CompletedRequest />,
      icon: <MdIncompleteCircle />,
    },
  ];
  return (
    <div className="mt-20 sm:mt-0 p-2">
      <Tabs defaultActiveKey="1" items={items} className="sm:mt-0 mt-20" />
    </div>
  );
};

export default WorkerRequests;
