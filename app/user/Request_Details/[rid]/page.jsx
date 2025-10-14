import React ,{use}from "react";
import { Tabs } from "antd";
import { CgDetailsMore } from "react-icons/cg";
import { TbTimeline } from "react-icons/tb";
import { RiCalendarScheduleFill } from "react-icons/ri";
import AcceptedBy from "../_Components/AcceptedBy";
import { FaCircleCheck } from "react-icons/fa6";
import RequestDetailsServer from "../_Components/RequestDetails/RequestDetialsServer";
import RescheduleServer from "../_Components/Reschedule/RescheduleServer";
import TimeLineServer from "../_Components/TimeLine/TimeLineServer";

export default function Page({ params }) {
  const { rid } = use(params);
  
  if (!rid) {
    return <p>Error: Request ID not found.</p>;
  }

  const items = [
    {
      key: "1",
      label: "Request Details",
      children: <RequestDetailsServer params={params} />,
      icon: <CgDetailsMore />,
    },
    {
      key: "2",
      label: "Reschedule",
      children: <RescheduleServer rid={rid} />,
      icon: <RiCalendarScheduleFill />,
    },
    {
      key: "3",
      label: "Accepted By",
      children: <AcceptedBy />,
      icon: <FaCircleCheck />,
    },
    {
      key: "4",
      label: "Timeline",
      children: <TimeLineServer rid={rid} />,
      icon: <TbTimeline />,
    },
  ];

  return (
    <div className="mt-20 sm:mt-0 p-2 ">
      <Tabs defaultActiveKey="1" items={items} className="sm:mt-0 mt-20" />
    </div>
  );
}
