"use client";

import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";
import { MdDeleteOutline } from "react-icons/md";
import { styled } from "@mui/joy";
import Select from "react-select";
import { Button as CustomButton } from "@/components/ui/button";
import { UpdateProfile } from "../_FetchFunction/UpdateUserProfile";
import { style } from "../../../_Arrays/Arrays";
import toast, { Toaster } from "react-hot-toast";

const ImageEditModal = ({ handleClose, GetWorkerData, data, services }) => {
  const [image, setImage] = useState(null);
  const [name, SetName] = useState(data.Name);
  const [service, setService] = useState(data.ServiceType);
  const [MobileNo, SetMobileNo] = useState(data.MobileNo);
  const [loading, setLoading] = useState(false);
  const [subServiceOptions, setSubServiceOptions] = useState([data.SubServices]);
  const [selectedSubServices, setSelectedSubServices] = useState(
    data.SubServices.map((sub) => ({
      value: sub,
      label: sub.replace(/_/g, " "),
    }))
  );
 console.log("Services to : ", service);
  async function UpdateUser() {
    setLoading(true);
    try {
      const authString = localStorage.getItem("auth");
      if (!authString) {
        toast.error("User authentication not found.");
        setLoading(false);
        return;
      }

      const auth = JSON.parse(authString);
      if (!auth?.user?._id) {
        toast.error("User ID is missing. Please re-login.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      if (image?.file) {
        formData.append("image", image.file);
      }
      if (name.trim()) {
        formData.append("Name", name);
      }
      if (service) {
        formData.append("ServiceType", service.label);
      }
      if (MobileNo) {
        formData.append("MobileNo", MobileNo);
      }
      console.log("Selected Sub Services: ", selectedSubServices);
      
      if (selectedSubServices.length > 0) {
        formData.append(
          "SubServices",
          JSON.stringify(selectedSubServices.map((sub) => sub.label))
        );
      }

      const result = await UpdateProfile(auth.user._id, formData);

      if (result.success) {
        toast.success(result.message || "Profile updated successfully.");
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Hide Backdrop
      GetWorkerData();
    }
  }

  const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage({ file, url: imageUrl });
    }
  };

  function HandleMobileNumber(e) {
    const inputValue = e.target.value;
    if (inputValue.toString().length <= 10) {
      SetMobileNo(e.target.value);
    }
  }

  useEffect(() => {
    const initialService = services.find(
      (option) => option.value === data.ServiceType
    );
    if (initialService) {
      setService(initialService);
    }
  }, [data.ServiceType]);

  useEffect(() => {
    if (service.subServices) {
      setSubServiceOptions(
        service.subServices.map((sub) => ({
          value: sub.toLowerCase().replace(/\s+/g, "_"),
          label: sub,
        }))
      );
    }
  }, [service]);

  useEffect(() => {
    if (Array.isArray(services) && services.length > 0 && data.ServiceType) {
      // Try to match by value (id) or label (name)
      const initialService = services.find(
        (option) =>
          option.value === data.ServiceType ||
          option.label === data.ServiceType
      );
      if (initialService) {
        setService(initialService);
      }
    }
  }, [services, data.ServiceType]);

  return (
    <Box
      sx={style}
      className="w-[350px] sm:w-[550px] flex flex-col gap-3 rounded-md"
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <p className="text-xl font-semibold text-center">Edit your profile</p>
      <hr />

      <div className="flex flex-col items-center w-full mt-2">
        <Button
          component="label"
          variant="outlined"
          color="neutral"
          className="w-full"
          startDecorator={
            <SvgIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </SvgIcon>
          }
        >
          Upload your image
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        {image && (
          <div className="mt-2 flex flex-col">
            <MdDeleteOutline
              className="text-red-600 text-xl cursor-pointer"
              onClick={() => setImage(null)}
            />
            <img
              src={image.url}
              alt="Uploaded preview"
              style={{ maxWidth: "100%", height: "200px" }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="name" className="text-sm m-0 font-medium text-gray-700">
          Edit Name
        </label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => SetName(e.target.value)}
          placeholder="Edit Name"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="service" className="text-sm font-medium text-gray-700">
          Change Expertise
        </label>
        <Select
          id="service"
          required
          options={services}
          value={service}
          onChange={setService}
          className="w-full"
          placeholder="Change expertise"
        />
      </div>
      <div>
        <label
          htmlFor="subService"
          className="text-sm font-medium text-gray-700"
        >
          Select Sub Services
        </label>
        <Select
          id="subService"
          required
          options={subServiceOptions}
          value={selectedSubServices}
          onChange={setSelectedSubServices}
          isMulti
          className="w-full"
          placeholder="Add sub service"
        />
      </div>

      <div>
        <label htmlFor="MobileNo" className="text-sm font-medium text-gray-700">
          Edit Mobile Number
        </label>
        <Input
          id="MobileNo"
          name="MobileNo"
          value={MobileNo}
          onChange={HandleMobileNumber}
          placeholder="Edit Mobile Number"
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1">
        <CustomButton
          onClick={() => {
            UpdateUser();
            setTimeout(() => {
              handleClose();
              // GetWorkerData();
            }, 2000);
          }}
        >
          Save
        </CustomButton>
        <CustomButton onClick={handleClose}>Close</CustomButton>
      </div>
    </Box>
  );
};

export default ImageEditModal;
