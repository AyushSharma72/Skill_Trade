"use client";
import { useState, useRef, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  MapPin,
  Hash,
  Wrench,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";

const WorkerRegisterForm = ({ setLoading, loading }) => {
  const router = useRouter();

  // State for password visibility and validation
  const [showPassword, setShowPassword] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [getServices, setGetServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const [suggestions, setSuggestions] = useState([]);
  const API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;

  // Debounce ref for address suggestions
  const debounceTimeout = useRef(null);

  // OTP related states
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Re-added password state
  const [passwordValidation, setPasswordValidation] = useState({
    // Re-added passwordValidation state
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const [passwordFocused, setPasswordFocused] = useState(false);
  // Effect to validate password as it changes
  useEffect(() => {
    // Re-added useEffect for password validation
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


  // Toggles password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleServiceTypeChange = (value) => {
    const selectedService = getServices.find(
      (service) => service.value === value
    );
    if (selectedService) {
      setServiceType(selectedService.label);
      setServiceId(selectedService.value);
     
    }
  };

  // Handles address input and debounces API call for suggestions
  const handleAddressChange = (query) => {
    setAddress(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (query.length < 2) {
        setSuggestions([]); // Clear suggestions if query is too short
        return;
      }

      try {
        const response = await fetch(
          `https://autosuggest.search.hereapi.com/v1/autosuggest?at=28.6139,77.2090&q=${query}&apiKey=${API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data.items || []);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setSuggestions([]);
      }
    }, 1500); // 1s debounce delay
  };

  // Selects an address from suggestions and sets coordinates
  const selectAddress = (place) => {
    setAddress(place.title);
    setCoordinates({ lat: place.position.lat, lon: place.position.lng });
    setSuggestions([]); // Clear suggestions after selection
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/get_active_services`
      );

      const result = await response.json();
      if (result.success && result.data) {
        const options = result.data.map((service) => ({
          value: service._id,
          label: service.serviceName,
        }));
        setGetServices(options);
      } else {
        toast("Using sample data - API returned no data");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast("Using sample data - API not available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Generates a 6-digit OTP
  function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    return otp;
  }

  // Sends OTP to the provided email
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

  // Verifies the entered OTP
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
            otp,
            generatedOtp,
            foremail: true,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Email verification successful");
        setEmailVerified(true);
        localStorage.setItem("emailVerified", "true"); // Persist verification status
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

  // Handles worker registration form submission
  async function RegisterWorker(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const Name = formData.get("Name");
    const Password = formData.get("Password");
    const pincode = formData.get("pincode");

    // Client-side validations
    if (!serviceType || !serviceId) {
      toast.error("Please select a service type");
      return;
    }
    // Password validation is handled by the useEffect and UI feedback, but a final check here is good.
    if (
      !passwordValidation.length ||
      !passwordValidation.lowercase ||
      !passwordValidation.uppercase ||
      !passwordValidation.number ||
      !passwordValidation.special
    ) {
      toast.error("Please ensure your password meets all criteria.");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }
    if (!address || !coordinates.lat || !coordinates.lon) {
      toast.error("Please select a valid address from the suggestions");
      return;
    }
    if (!emailVerified) {
      toast.error("Please verify your email before registering");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/WorkerRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            Email: email, // Use the email state
            MobileNo: mobileNo,
            Address: address,
            Latitude: coordinates.lat,
            Longitude: coordinates.lon,
            Password,
            ServiceType: serviceType,
            ServiceId: serviceId,
            pincode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success(result.message);
        event.target.reset(); // Reset form fields
        setAddress("");
        setCoordinates({ lat: "", lon: "" });
        setEmail("");
        setEmailVerified(false);
        localStorage.removeItem("emailVerified"); // Clear verification status from local storage
        router.push("/login"); // Redirect to login page
      } else {
        setLoading(false);
        toast.error(result.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Create Service Provider Account
          </CardTitle>
          <CardDescription className="text-slate-600">
            Join our platform as a service provider and start earning
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={RegisterWorker} className="space-y-6">
            {/* Full Name Input */}
            <div className="space-y-1">
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

            {/* Mobile Number Input */}
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

            {/* Email Address Input and Verification */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your email address"
                />
              </div>
              {!emailVerified && (
                <div className="flex justify-between items-center mt-1">
                  <p className="text-orange-500 text-xs">
                    Email verification required
                  </p>
                  <Button
                    type="button"
                    onClick={sendOtp}
                    disabled={sendingOtp || !email}
                    className="text-xs h-8 bg-black text-white hover:bg-gray-900 px-3 py-1 rounded"
                  >
                    {sendingOtp ? "Sending..." : "Verify Email"}
                  </Button>
                </div>
              )}
              {emailVerified && (
                <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Email verified
                </div>
              )}
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
                  value={password} // Added value binding
                  onChange={(e) => setPassword(e.target.value)} // Added onChange handler
                  onFocus={() => setPasswordFocused(true)} // Added onFocus handler
                  onBlur={() => setPasswordFocused(false)} // Added onBlur handler
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
              <ul
                className={`mt-2 space-y-1 text-sm transition-opacity duration-200 ${
                  passwordFocused ||
                  Object.values(passwordValidation).every(Boolean)
                    ? "opacity-100 max-h-40"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <li
                  className={
                    passwordValidation.length
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                >
                  ✔ Minimum 8 characters
                </li>
                <li
                  className={
                    passwordValidation.lowercase
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                >
                  ✔ One lowercase letter
                </li>
                <li
                  className={
                    passwordValidation.uppercase
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                >
                  ✔ One uppercase letter
                </li>
                <li
                  className={
                    passwordValidation.number
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                >
                  ✔ One number
                </li>
                <li
                  className={
                    passwordValidation.special
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                >
                  ✔ One special character
                </li>
              </ul>
            </div>

            {/* Address Input with Suggestions */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-700">
                Your Closest Working Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Start typing your address..."
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-48 overflow-auto">
                    {suggestions.map((place, index) => (
                      <div
                        key={index}
                        onClick={() => selectAddress(place)}
                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-slate-800">
                          {place.title}
                        </div>
                        {place.vicinity && (
                          <div className="text-xs text-slate-500 mt-1">
                            {place.vicinity}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Area Pincode Input */}
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
                  name="pincode"
                  type="number"
                  required
                  maxLength={6} // Added maxLength directly
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your area pincode"
                />
              </div>
            </div>

            {/* Service Type Select */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-700">
                Service Type
              </Label>
              <div className="relative">
                <Wrench className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Select required onValueChange={handleServiceTypeChange}>
                  <SelectTrigger className="h-12 pl-10 border-slate-200 focus:border-slate-400">
                    <SelectValue placeholder="Select your service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getServices.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-white font-medium"
              disabled={loading || !emailVerified}
            >
              {loading
                ? "Creating Account..."
                : "Create Service Provider Account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* OTP Verification Modal */}
      <Dialog open={openOtpModal} onOpenChange={setOpenOtpModal}>
        <DialogContent
          className="sm:max-w-md"
          modal={true}
          onInteractOutside={(e) => e.preventDefault()}
        >
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
                  <InputOTPSlot index={0} className="w-12" />
                  <InputOTPSlot index={1} className="w-12" />
                  <InputOTPSlot index={2} className="w-12" />
                  <InputOTPSlot index={3} className="w-12" />
                  <InputOTPSlot index={4} className="w-12" />
                  <InputOTPSlot index={5} className="w-12" />
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

export default WorkerRegisterForm;
