"use client";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Box from "@mui/material/Box";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";
import { MdDeleteOutline } from "react-icons/md";
import { styled } from "@mui/joy";
import { Button as CustomButton } from "@/components/ui/button";
import { UpdateProfile } from "../_FetchFunction/UpdateUserProfile";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { style } from "../../../_Arrays/Arrays";
import toast, { Toaster } from "react-hot-toast";

const EditProfileModal = ({ handleClose, GetWorkerData, data }) => {
  const [vimage, setImage] = useState(null);
  const [address, setAddress] = useState(data.Address);
  const [city, setCity] = useState(data.city);
  const [pincode, setPincode] = useState(data.pincode);
  const [backdrop, Setbackdrop] = useState(false);
 
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

  function HandlePincode(e) {
    const inputValue = e.target.value;
    if (inputValue.toString().length <= 6) {
      setPincode(e.target.value);
    } else {
      return;
    }
  }
  async function UpdateUser() {
    try {
      const authString = localStorage.getItem("auth");
      if (!authString) {
        toast.error("User authentication not found.");
        return;
      }

      const auth = JSON.parse(authString);
      if (!auth?.user?._id) {
        toast.error("User ID is missing. Please re-login.");
        return;
      }

      const formData = new FormData();
      if (vimage?.file) {
        formData.append("vimage", vimage.file);
      }
      if (address.trim()) {
        formData.append("address", address);
      }
      if (pincode) {
        formData.append("pincode", pincode);
      }
      if (city) {
        formData.append("city", city);
      }
      Setbackdrop(true);
      const result = await UpdateProfile(auth.user._id, formData);

      if (result.success) {
        toast.success(result.message || "Profile updated successfully.");
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred  Please try again.");
    } finally {
      Setbackdrop(false);
      GetWorkerData();
    }
  }

  return (
    <Box
      sx={style}
      className="w-[350px] sm:w-[550px] flex flex-col gap-3 rounded-md"
    >
      <p className="text-xl font-semibold text-center">Edit your profile</p>
      <hr />{" "}
      <div className="flex flex-col items-center w-full mt-2">
        {data.Verified.verified === "Verified" ||
        data?.Verified.verified === "Pending" ? null : (
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
            Upload your verification id
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
        )}
        {vimage && (
          <div className="mt-2 flex flex-col">
            <MdDeleteOutline
              className="text-red-600 text-xl cursor-pointer"
              onClick={() => setImage(null)}
            />
            <img
              src={vimage.url}
              alt="Uploaded preview"
              style={{ maxWidth: "100%", height: "200px" }}
            />
          </div>
        )}
      </div>
      <div>
        <label
          htmlFor="address"
          className="text-sm m-0 font-medium text-gray-700"
        >
          Edit Address
        </label>
        <Input
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Edit Address"
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="city" className="text-sm m-0 font-medium text-gray-700">
          Edit City
        </label>
        <Input
          id="city"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Edit City"
          className="w-full"
        />
      </div>
      <div>
        <label
          htmlFor="pincode"
          className="text-sm m-0 font-medium text-gray-700"
        >
          Edit Pincode
        </label>
        <Input
          id="pincode"
          name="pincode"
          value={pincode}
          onChange={HandlePincode}
          placeholder="Edit Pincode"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-1">
        {" "}
        <CustomButton
          onClick={() => {
            UpdateUser();
            setTimeout(() => {
              handleClose();
            }, 3000);
          }}
        >
          Save
        </CustomButton>
        <CustomButton onClick={handleClose}>Close</CustomButton>
      </div>
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default EditProfileModal;
