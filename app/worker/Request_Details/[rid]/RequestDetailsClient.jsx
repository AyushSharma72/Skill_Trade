"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import moment from "moment";

// UI Components
import { Button } from "../../../../components/ui/button";
import { Typography, Alert } from "@mui/material";
import { Tag, Image } from "antd";
import { PulseLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";

// Icons
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { MdOutlineHandyman, MdOutlineTextSnippet } from "react-icons/md";
import { FaLocationDot, FaCalendarCheck, FaAddressCard } from "react-icons/fa6";
import { SiStatuspage } from "react-icons/si";
import { TbMapPinCode, TbMessageReport } from "react-icons/tb";

// Modals & Components
import ModalComponent from "../../../_components/Modal";
import ReportModal from "../_Modals/ReportModal";
import AcceptRequest from "../_Modals/AcceptRequest";
import { useAuth } from "@/app/_context/UserAuthContent";

// Assets

const RequestDetailsClient = ({
  IntialRequestData,
  loadingstate,
  requestimage,
}) => {
  const [data, setData] = useState(IntialRequestData);
  const [loading, setLoading] = useState(loadingstate);
  const { rid } = useParams();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [WorkerCoordinates, SetWorkerCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [ban, SetBan] = useState(false);
  const [auth, Setauth] = useAuth();
  const handleClose = () => setOpen(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const checkBan = async () => {
    try {
      if (!auth.user) {
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/CheckBan/${auth?.user?._id}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      } else {
        SetBan(data?.worker?.Banned?.ban);
      }
      return data;
    } catch (error) {
      console.error("Error checking ban status:", error);
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    const userCoordinates = JSON.parse(localStorage.getItem("userCoordinates"));
    if (userCoordinates) {
      SetWorkerCoordinates({
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
      });
    } else {
      console.log("No user coordinates found in localStorage.");
    }
    checkBan();
  }, []);

  function CheckIfAlreadyAccepted(acceptedBy, authUserId) {
    return acceptedBy.some((obj) => {
      if (!obj.worker) return false;
      return String(obj.worker) === String(authUserId); // if the worker id is same as the person who accepted request
    });
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center mb-10 sm:mt-0 mt-20">
        <Toaster position="bottom-center" reverseOrder={false} />
        <p className="text-3xl font-bold mt-5">Request Details</p>

        {data?.status === "Deleted" && (
          <Alert severity="error" className="w-full mt-4">
            This request was deleted.
          </Alert>
        )}

        {loading ? (
          <div className="h-[600px] w-full flex items-center justify-center">
            <span className="flex gap-2 text-xl items-center font-semibold text-gray-600">
              Loading Data <PulseLoader size={12} color="#4A90E2" />
            </span>
          </div>
        ) : (
          <>
            {data ? (
              <div className="flex flex-col lg:flex-row gap-6 bg-white shadow-lg rounded-lg lg:p-6 lg:w-3/4 w-full p-2">
                {/* Image Section */}
                <div className="flex flex-col items-center lg:w-2/5 ">
                  <Image
                    src={requestimage}
                    className="object-cover rounded-md lg:!h-[400px] lg:!w-full !h-[300px] justify-center"
                  />
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-4 lg:w-3/5 bg-gray-50 p-4 rounded-md relative">
                  {auth?.user?.role === 1 &&
                  data.status != "Completed" &&
                  data.status != "Deleted" ? (
                    <div
                      className="absolute top-4 right-5 flex items-center gap-1 cursor-pointer text-gray-500"
                      onClick={() => setOpen(true)}
                    >
                      <TbMessageReport /> Report
                    </div>
                  ) : null}

                  {/* Service Type */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <MdOutlineHandyman /> Service type:
                    </span>
                    <p className="text-base">{data.service}</p>
                  </div>
                  <hr />
                  {/* description  */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <MdOutlineTextSnippet /> Description:
                    </span>
                    <p className=" text-base">{data.description}</p>
                  </div>
                  <hr />

                  {/* Address */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <FaAddressCard /> Address:
                    </span>
                    <p className="text-base">
                      <a
                        href={
                          data.coordinates?.coordinates[1]
                            ? `https://www.google.com/maps?q=${data.coordinates?.coordinates[1]},${data.coordinates?.coordinates[0]}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                data.location
                              )}`
                        }
                        target="_blank"
                        className="text-blue-500"
                      >
                        {" "}
                        {data.location}
                      </a>
                    </p>
                  </div>
                  <hr />

                  {/* Pincode */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <TbMapPinCode /> Pincode:
                    </span>
                    <p className="text-base">{data.pincode}</p>
                  </div>
                  <hr />

                  {/* City */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <FaLocationDot /> City:
                    </span>
                    <p className="text-base">{data.city}</p>
                  </div>
                  <hr />

                  {/* Visiting Date */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <FaCalendarCheck /> Visiting Date:
                    </span>
                    <p className="text-base">
                      {data.date ? (
                        <>
                          {moment(data.date).format("MMMM Do YYYY")} at{" "}
                          {data.time}
                        </>
                      ) : (
                        "No date available"
                      )}
                    </p>
                  </div>
                  <hr />

                  {/* Status */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <SiStatuspage /> Status:
                    </span>
                    <div>
                      {data.status === "Pending" ? (
                        <Tag icon={<ClockCircleOutlined />} color="warning">
                          Pending
                        </Tag>
                      ) : data.status === "Accepted" ? (
                        <Tag icon={<CheckCircleOutlined />} color="blue">
                          Accepted
                        </Tag>
                      ) : data.status === "Assigned" ? (
                        <Tag icon={<CheckCircleOutlined />} color="green">
                          Assigned
                        </Tag>
                      ) : data.status === "Completed" ? (
                        <Tag icon={<CheckCircleOutlined />} color="purple">
                          Completed
                        </Tag>
                      ) : (
                        <Tag icon={<CheckCircleOutlined />} color="red">
                          {data.status}
                        </Tag>
                      )}
                    </div>
                  </div>
                  <hr />

                  {/* Created By */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <FaLocationDot /> Created by:
                    </span>
                    <p className="text-base">
                      {data.user.Name} on{" "}
                      {moment(data.createdAt).format("MMMM Do YYYY, h:mm A")}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    {auth?.user?.role !== 1 ||
                    data.status === "Completed" ||
                    data.status === "Deleted" ? null : CheckIfAlreadyAccepted(
                        data.acceptedBy,
                        auth?.user?._id
                      ) ? (
                      <Button
                        onClick={handleOpen2}
                        className="w-full sm:w-1/2"
                        disabled={true}
                      >
                        Already Accepted
                      </Button>
                    ) : (
                      <Button
                        onClick={handleOpen2}
                        className="w-full sm:w-1/2"
                        disabled={ban}
                      >
                        Accept Request
                      </Button>
                    )}

                    <Link
                      href={
                        auth?.user?.role === 1
                          ? `/worker/all_request`
                          : `/admin/reports`
                      }
                      className="w-full sm:w-1/2 m-auto"
                    >
                      <Button className="w-full ">Back</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Typography variant="h5" className="mb-4 text-center">
                  Request not found
                </Typography>
                <Image
                  src="/Empty.svg"
                  alt="No Data"
                  width={400}
                  height={400}
                  className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]"
                />
                <Link href="/">
                  <Button className="mt-4">Go Home</Button>
                </Link>
              </div>
            )}

            {/* Report Modal */}
            <ModalComponent
              open={open}
              handleClose={handleClose}
              ModalType={ReportModal}
              id={rid}
            />
            {/* Accept Request Modal */}
            <ModalComponent
              open={open2}
              handleClose={handleClose2}
              ModalType={AcceptRequest}
              id={rid}
            />
          </>
        )}
      </div>
    </>
  );
};

export default RequestDetailsClient;
