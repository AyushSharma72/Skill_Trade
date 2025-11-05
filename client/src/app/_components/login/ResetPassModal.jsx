"use client"
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Input } from "@mui/joy";
import { Button } from "@/components/ui/button";import dynamic from "next/dynamic";
import { style } from "../../_Arrays/Arrays";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";

const ResetPassModal = ({ handleClose, email }) => {
 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required !");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match !");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password length must be more than 6 characters !");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/Resetpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Password reset successful!");
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Box
      sx={style}
      className="w-[300px] sm:w-[400px] flex flex-col gap-3 rounded-md"
    >
      <p className="text-xl font-semibold text-center">Reset Password</p>

      <hr />

      <div>
        <label
          htmlFor="newPassword"
          className="text-sm m-0 font-medium text-gray-700"
        >
          New Password
        </label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full"
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm m-0 font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full"
            type={showConfirmPassword ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2"
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
      </div>

      <div className="flex justify-evenly mt-4">
        <Button onClick={handleResetPassword} disabled={loading}>
          {loading ? "Processing..." : "Reset Password"}
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </Box>
  );
};

export default ResetPassModal;
