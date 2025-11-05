// Final version of UserRegisterForm.jsx with all fields and hydration-safe password rules
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, MapPin, Hash, Shield } from "lucide-react";
import toast from "react-hot-toast";

import PhoneInput from "react-phone-input-2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "react-phone-input-2/lib/style.css";

const UserRegisterForm = ({ loading, setLoading }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // Added password state and validation states
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [formData, setFormData] = useState({});

  // Effect to validate password as it changes
  useEffect(() => {
    const val = password;
    const validation = {
      length: val.length >= 8,
      lowercase: /[a-z]/.test(val),
      uppercase: /[A-Z]/.test(val),
      number: /\d/.test(val),
      special: /[^A-Za-z0-9]/.test(val),
    };
    setPasswordValidation(validation);
  }, [password]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    if (e.target.name === "Email") {
      setEmail(e.target.value);
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp);
    return otp;
  }

  async function sendOtp() {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setSendingOtp(true);
      const otp = generateOTP();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/SendEmailVerificationOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ GeneratedOtp: otp, email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent successfully");
        setOpenOtpModal(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  }

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Valid OTP is required");
      return;
    }

    try {
      setVerifyingOtp(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/VerifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp, // user entered OTP
            generatedOtp, // stored/generated OTP from frontend
            foremail: true,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Email verification successful");
        setEmailVerified(true);
        localStorage.setItem("emailVerified", "true");
        setOpenOtpModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };


  async function RegisterUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const Name = formData.get("Name");
    const Email = formData.get("Email");
    const Password = formData.get("Password");
    const Address = formData.get("Address");
    const Pincode = formData.get("Pincode");

    // Client-side password validation check before submission
    if (!passwordValidation.length || !passwordValidation.lowercase || !passwordValidation.uppercase || !passwordValidation.number || !passwordValidation.special) {
      toast.error("Please ensure your password meets all criteria.");
      return;
    }

    if (!emailVerified) {
      toast.error("Please verify your email before creating an account");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/UserRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            MobileNo: mobileNo,
            Email,
            Password,
            Address,
            Pincode,
            email_verified: true, // Set email as verified
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success(result.message);
        event.target.reset();
        setMobileNo("");
        setEmail("");
        setEmailVerified(false);
        localStorage.removeItem("emailVerified");
        router.push("/login");
      } else {
        setLoading(false);
        toast.error(result.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Please try again");
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Create User Account
          </CardTitle>
          <CardDescription className="text-slate-600">
            Fill in your details to create your user account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={RegisterUser} className="space-y-6">
            <div className="space-y-1 w-full">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  name="Name"
                  type="text"
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-700">
                Mobile Number
              </Label>
              <PhoneInput
                country={"in"}
                value={mobileNo}
                onChange={(value) => setMobileNo(value)}
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  paddingLeft: "48px",
                  fontSize: "14px",
                }}
                buttonStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px 0 0 6px",
                  backgroundColor: "#f8fafc",
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="Email"
                  type="email"
                  required
                  value={email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your email address"
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>
                  {emailVerified ? (
                    <span className="text-xs text-green-600 flex items-center">
                      <Shield className="h-3 w-3 mr-1" /> Email verified
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600">
                      Email verification required
                    </span>
                  )}
                </div>
                {!emailVerified && (
                  <Button
                    type="button"
                    onClick={sendOtp}
                    disabled={sendingOtp || !email}
                    className="text-xs h-8 bg-black text-white hover:bg-gray-900"
                  >
                    {sendingOtp ? "Sending..." : "Verify Email"}
                  </Button>
                )}
              </div>
            </div>

            {/* Password Input and Validation Rules */}
            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password} // Bind value to state
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                  onFocus={() => setPasswordFocused(true)} // Set focus state
                  onBlur={() => setPasswordFocused(false)} // Clear focus state
                  className="pr-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Password validation rules display */}
              <ul className={`mt-2 space-y-1 text-sm transition-opacity duration-200 ${passwordFocused || Object.values(passwordValidation).every(Boolean) ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"}`}>
                <li className={passwordValidation.length ? "text-green-600" : "text-slate-400"}>✔ Minimum 8 characters</li>
                <li className={passwordValidation.lowercase ? "text-green-600" : "text-slate-400"}>✔ One lowercase letter</li>
                <li className={passwordValidation.uppercase ? "text-green-600" : "text-slate-400"}>✔ One uppercase letter</li>
                <li className={passwordValidation.number ? "text-green-600" : "text-slate-400"}>✔ One number</li>
                <li className={passwordValidation.special ? "text-green-600" : "text-slate-400"}>✔ One special character</li>
              </ul>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-slate-700"
              >
                Full Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="address"
                  name="Address"
                  type="text"
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="pincode"
                className="text-sm font-medium text-slate-700"
              >
                Area Pincode
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="pincode"
                  name="Pincode"
                  type="number"
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your area pincode"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-medium"
              disabled={loading || !emailVerified}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* OTP Verification Modal */}
      <Dialog open={openOtpModal} onOpenChange={setOpenOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold text-center">
              Verify Your Email
            </DialogTitle>
            <DialogDescription className="text-center">
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Enter verification code
              </Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="w-full justify-center gap-2">
                  <InputOTPSlot index={0} className="w-12"/>
                  <InputOTPSlot index={1} className="w-12"/>
                  <InputOTPSlot index={2} className="w-12"/>
                  <InputOTPSlot index={3} className="w-12"/>
                  <InputOTPSlot index={4} className="w-12"/>
                  <InputOTPSlot index={5} className="w-12"/>
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full h-11"
              onClick={verifyOtp}
              disabled={verifyingOtp || otp.length !== 6}
            >
              {verifyingOtp ? "Verifying..." : "Verify Email"}
            </Button>

            <Button
              variant="link"
              className="text-sm"
              onClick={sendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? "Sending..." : "Didn't receive the code? Resend"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRegisterForm;