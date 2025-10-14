"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/_context/UserAuthContent";
import { useParams } from "next/navigation";
import moment from "moment";

// Direct imports
import Rating from "@mui/material/Rating";
import {
  FaSquareWhatsapp,
  FaSquarePhone,
  FaCircleUser,
  FaAddressCard,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { TbMapPinCode } from "react-icons/tb";
import { PiCityFill } from "react-icons/pi";
import { SiTicktick } from "react-icons/si";
import { IoIosTime } from "react-icons/io";
import { Badge, Space } from "antd";

import ModalComponent from "./_Components/Modal";
import ImageEditModal from "./Modals/ImageEditModal";
import EditProfileModal from "./Modals/EditProfileModal";
import Chip from "@mui/material/Chip";
import Ratings from "./_Components/Ratings";

import Lottie from "react-lottie";
import animationData from "../../_Arrays/loading.json";

import Alert from "@mui/material/Alert";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const WorkerProfileClient = ({ IntialWorkerData }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [services, setServices] = useState([]);
  const [auth, SetAuth] = useAuth();
  const handleOpen = () => setOpen(true);
  const handleOpen2 = () => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const [WorkerData, SetWorkerData] = useState(IntialWorkerData);
  const [imageError, setImageError] = useState(false);
  const { wid } = useParams();

  <Space
    direction="vertical"
    size="middle"
    style={{
      width: "100%",
    }}
  ></Space>;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  async function GetWorkerData() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/GetWorkerData/${wid}`
      );
      if (response) {
        const data = await response.json();
        if (data.success) {
          SetWorkerData(data.worker);
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Error fetching data");
      }
    } catch (error) {
      toast.error("error try again");
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/get_active_services`);
      const result = await response.json();

      if (result.success && result.data) {
        const options = result.data.map(service => ({
          value: service._id,
          label: service.serviceName,
          subServices: service.subServices || [], // Correct key and fallback
        }));

        setServices(options);
      } else {
        toast('Using sample data - API returned no data');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast('Using sample data - API not available');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (!auth?.user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Lottie
          options={defaultOptions}
          height={150}
          width={200}
          isClickToPauseDisabled={true}
        />
        <p className="font-bold tracking-wider">Loading auth.....</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center   bg-gray-200 ">
      <Toaster position="bottom-center" reverseOrder={false} />
      <p className="font-semibold text-3xl sm:mt-2 mt-20"> WorkerProfile</p>
      {auth?.user?.role === 1 ? (
        WorkerData?.Verified.verified === "Unverified" ? (
          <Alert severity="warning" className="w-[73%] mt-5">
            Your profile is unverified add verification id (AddharCard Or
            PanCard) by editing you profile.
          </Alert>
        ) : WorkerData?.Verified.verified === "Pending" ? (
          <Alert severity="warning" className="w-[73%] mt-5">
            Profile verification is currently pending with the administrator
          </Alert>
        ) : WorkerData?.Verified.verified === "Rejected" ? (
          <Alert severity="error" className="w-[73%] mt-5">
            your verification request was rejected
            <br></br>
            Reason:{WorkerData?.Verified.rejectedReason}
          </Alert>
        ) : WorkerData?.Banned?.ban ? (
          <Alert severity="error" className="w-[73%] mt-5">
            {`Your profile was banned until ${new Date(
              WorkerData?.Banned?.tillDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })} due to lack of a solid reason for unassigning requests.`}
          </Alert>
        ) : null
      ) : null}
      <div className="flex justify-center md:gap-5 items-center md:items-start p-3 w-full md:flex-row flex-col  gap-5">
        {/* left div  */}
        <div className="xl:w-[20%] lg:w-[25%] sm:w-1/2 w-[90%] ">
          {" "}
          <Badge.Ribbon
            text={WorkerData.Verified.verified}
            color={
              WorkerData?.Verified.verified === "Unverified" ||
              WorkerData?.Verified.verified === "Rejected"
                ? "red"
                : WorkerData?.Verified.verified === "Pending"
                ? "orange"
                : undefined
            }
            placement="start"
          >
            {auth.user.role === 1 ? (
              <FaEdit
                className="absolute right-3 top-[50%] cursor-pointer"
                title="edit profile"
                onClick={handleOpen}
              />
            ) : null}
            <div className="flex flex-col justify-start gap-3">
              {/* image */}

              <div className="flex flex-col justify-center items-center  gap-1 rounded-lg shadow-lg bg-white">
                {" "}
                <Image
                  src={
                    imageError
                      ? "/demouserimage.jpg" // Fallback image if error occurs
                      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/GetWorkerImage/${wid}`
                  }
                  alt="Worker"
                  className="shadow-md !h-[200px] w-[200px] object-cover rounded-[50%]"
                  onError={() => setImageError(true)}
                  width={200}
                  height={200}
                />
                <div className="flex flex-col w-full pl-3 pb-3 gap-3">
                  {" "}
                  <p className="text-2xl font-semibold">{WorkerData?.Name}</p>
                  <p className="flex  items-center gap-3">
                    <span className="flex items-center font-semibold">
                      {WorkerData?.OverallRaitngs?.toString().substring(0, 3)}

                      <Rating max={1} defaultValue={1} />
                    </span>

                    {WorkerData?.OverallRaitngs === 0 ? (
                      <span className="text-sm font-bold">No rating given</span>
                    ) : (
                      <span
                        className="text-sm font-semibold cursor-pointer text-blue-600"
                        onClick={() => {
                          const reviewsElement =
                            document.getElementById("reviews");
                          if (reviewsElement) {
                            reviewsElement.scrollIntoView({
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        {WorkerData?.Reviews?.length} Reviews
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2 items-start">
                    <p className="tracking-wider flex items-center gap-1 font-semibold">
                      Expertise:
                    </p>{" "}
                    <Chip label={`${WorkerData.ServiceType}`} size="small" />
                  </div>
                  <div className="flex gap-1 items-start flex-wrap">
                    {WorkerData.SubServices.map((subservice, index) => (
                      <Chip
                        key={index}
                        label={`${subservice}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white p-3  rounded-lg  flex flex-col gap-3 shadow-lg">
                <div
                  className="flex  items-center gap-2 cursor-pointer"
                  onClick={() => {
                    const url = `https://wa.me/${WorkerData?.MobileNo}`;
                    window.open(url, "_blank");
                  }}
                >
                  <FaSquareWhatsapp className="text-3xl  text-green-600" />
                  Message on whatsapp
                </div>
                <hr />
                <div
                  className="flex  items-center gap-2 cursor-pointer"
                  onClick={() => {
                    const url = `tel:${WorkerData?.MobileNo}`;
                    window.open(url, "_self");
                  }}
                >
                  <FaSquarePhone className="text-3xl text-blue-600" />
                  {WorkerData?.MobileNo}
                </div>
              </div>
            </div>
          </Badge.Ribbon>
        </div>
        {/* modal 1 */}
        <ModalComponent
          open={open}
          handleClose={handleClose}
          ModalType={ImageEditModal}
          data={WorkerData}
          GetWorkerData={GetWorkerData}
          services={services}
        />
        {/* modal 2 */}
        <ModalComponent
          open={open2}
          handleClose={handleClose2}
          ModalType={EditProfileModal}
          data={WorkerData}
          GetWorkerData={GetWorkerData}
        />
        {/* right div  */}
        <div className="bg-white xl:w-1/2 lg:w-[60%] w-[90%] p-5 rounded-lg flex flex-col gap-5 shadow-lg relative mb-2 ">
          {auth?.user.role === 1 ? (
            <FaEdit
              className="absolute right-3 top-2 cursor-pointer"
              title="edit profile"
              onClick={handleOpen2}
            />
          ) : null}
          <hr className="mt-2" />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <FaCircleUser className="text-xl" />
              Role
            </span>
            <p className="text-center">
              {WorkerData?.role === 1 ? "Worker" : "User"}
            </p>
          </div>

          {/* address */}
          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <FaAddressCard className="text-xl" />
              Address
            </span>
            <p className="text-center">{WorkerData?.Address}</p>
          </div>

          {/* pincode  */}

          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <TbMapPinCode className="text-xl" />
              Pincode
            </span>
            <p className="text-center">{WorkerData?.pincode}</p>
          </div>

          {/* city  */}

          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <PiCityFill className="text-xl" />
              City
            </span>
            <p className="text-center">
              {WorkerData?.city ? (
                WorkerData?.city
              ) : (
                <span className="text-red-600">not provided</span>
              )}
            </p>
          </div>

          {/* Assigned Request */}
          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <SiTicktick className="text-xl" />
              Profile verification
            </span>

            <p
              className={`text-center ${
                WorkerData?.Verified.verified === "Unverified" ||
                WorkerData?.Verified.verified === "Rejected"
                  ? "text-red-600"
                  : WorkerData?.Verified.verified === "Pending"
                  ? "text-yellow-600"
                  : WorkerData?.Verified.verified === "Verified"
                  ? "text-green-500"
                  : null
              }`}
            >
              {" "}
              {WorkerData?.Verified.verified}
            </p>
          </div>

          {/* Completed Request */}
          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <FaCheckCircle className="text-xl" />
              Completed requests
            </span>
            <p className="text-center">{WorkerData?.CompletedRequest}</p>
          </div>

          {/* joined  */}
          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <IoIosTime className="text-xl" />
              Joined
            </span>

            <p className="text-center">
              {moment(WorkerData.createdAt).format(" MMMM Do YYYY")}
            </p>
          </div>
        </div>
      </div>

      <Ratings Reviews={WorkerData.Reviews} />
    </div>
  );
};

export default WorkerProfileClient;
