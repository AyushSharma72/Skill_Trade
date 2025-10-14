"use client";
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useAuth } from "@/app/_context/UserAuthContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { Input } from "@mui/joy";
import { Input as Otp } from "antd";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast, { Toaster } from "react-hot-toast";

import ModalComponent from "../Modal";
import ResetPassModal from "./ResetPassModal";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Lock, Shield } from "lucide-react";

import { style } from "../../_Arrays/Arrays";

const LoginForm = () => {
  const [auth, SetAuth] = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [OtpGenerate, SetOtpGenerate] = useState(false);
  const [otp, setOtp] = useState("");
  const [SendingOtp, SetSendingOtp] = useState(false);
  const [GeneratedOtp, SetGeneratedOtp] = useState("");
  const [ResetPass, SetResetPass] = useState(false);
  const [VerifyOtp, SetVerifyOtp] = useState(false);
  const [mobileNo, setMobileNo] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleResetPassClose = () => SetResetPass(false);

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("OTP is required");
      return;
    }
    try {
      SetVerifyOtp(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/VerifyOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Verification successful");
        setOpen(false);
        setLoading(true);
      let ids =   setTimeout(() => {
          setLoading(false);
          SetResetPass(true);
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      clearTimeOut(ids)
      SetVerifyOtp(false);
    }
  };

  const onChange = (text) => setOtp(text);

  async function HandleLogin(event) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const Password = formData.get("Password");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/UserLogin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ MobileNo: mobileNo, Password }),
        }
      );
      const data = await response.json();
      if (data.success) {
        SetAuth({
          ...auth,
          user: data.user || data.worker,
          token: data.token,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: data.user || data.worker,
            token: data.token,
          })
        );
        event.target.reset();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function SendOtp() {
    try {
      SetSendingOtp(true);
      SetOtpGenerate(false);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      SetGeneratedOtp(otp);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/SendOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ GeneratedOtp: otp, email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent successfully");
        SetOtpGenerate(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      SetSendingOtp(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Toaster position="bottom-center" reverseOrder={false} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 sm:mt-0 mt-10">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Skill Trade account</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={HandleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={mobileNo}
                    onChange={(value) => setMobileNo(value)}
                    inputStyle={{
                      width: "100%",
                      height: "48px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      paddingLeft: "48px",
                      fontSize: "16px",
                    }}
                    buttonStyle={{
                      border: "1px solid #d1d5db",
                      borderRadius: "6px 0 0 6px",
                      backgroundColor: "#f9fafb",
                    }}
                    containerStyle={{ width: "100%" }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your password"
                    name="Password"
                    required
                    type={showPassword ? "text" : "password"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "48px",
                        borderRadius: "6px",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-gray-300"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-gray-600"
                      >
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpen}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-gray-900 hover:bg-gray-800"
                  disabled={loading}
                >
                  Sign In
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don&#39;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1"
            >
              <Shield className="h-3 w-3" />
              <span className="text-xs">
                Secured with 256-bit SSL encryption
              </span>
            </Badge>
          </div>
        </div>
      </div>

      {open && (
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              ...style,
              borderRadius: "12px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            className="flex flex-col gap-4 sm:w-[450px] w-[350px] p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Reset Password
                </h2>
              </div>
              <RxCross1
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                onClick={handleClose}
                size={20}
              />
            </div>

            {!OtpGenerate ? (
              <>
                <p className="text-gray-600 text-sm">
                  Enter your email address and we'll send you a verification
                  code to reset your password.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full"
                    required
                    sx={{
                      "--Input-radius": "6px",
                      "--Input-minHeight": "48px",
                    }}
                  />
                </div>
                <Button
                  onClick={() =>
                    email ? SendOtp() : toast.error("Enter email")
                  }
                  disabled={SendingOtp}
                  className="w-full h-11"
                >
                  {SendingOtp ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    We've sent a 6-digit verification code to{" "}
                    <strong>{email}</strong>.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <Otp.OTP
                    formatter={(str) => str.toUpperCase()}
                    onChange={onChange}
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      SetOtpGenerate(false);
                      setOtp("");
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={verifyOtp}
                    disabled={VerifyOtp}
                    className="flex-1"
                  >
                    {VerifyOtp ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                </div>
                <div className="text-center">
                  <button
                    onClick={() =>
                      email ? SendOtp() : toast.error("Enter email")
                    }
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    disabled={SendingOtp}
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </>
            )}
          </Box>
        </Modal>
      )}

      {ResetPass && (
        <ModalComponent
          handleClose={handleResetPassClose}
          open={ResetPass}
          ModalType={ResetPassModal}
          email={email}
        />
      )}

      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
};

export default LoginForm;
