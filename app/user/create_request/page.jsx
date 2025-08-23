"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Upload,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
  User,
  ImageIcon,
  Settings,
} from "lucide-react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import {
  // services,
  steps,
  timeOptions,
  cityOptions,
} from "../../_Arrays/Arrays";
import { useAuth } from "@/app/_context/UserAuthContent";
import UserPrivateRoutes from "../../_components/privateroutes/UserPrivateRoutes";

const CreateRequest = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [service, setService] = useState(null);
  const [getServices, setGetServices] = useState([]);
  const [customService, setCustomService] = useState("");
  const [description, setDescription] = useState("");
  const [time, settime] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState("");
  const [date, setdate] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [isCustomService, setIsCustomService] = useState(false);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [pincode, Setpincode] = useState(null);
  const [city, Setcity] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const workerId = searchParams.get("id");
  const workerName = searchParams.get("name");
  const expertise = searchParams.get("expertise");
  const defaultService = getServices.find((s) => s.value === expertise) || null;
  const minDate = new Date();
  const [auth] = useAuth();

  const locations = [
    {
      value: `${auth?.user?.Address}`,
      label: `Your account address (${auth?.user?.Address})`,
    },
    { value: "current", label: "Your current location" },
  ];

  const stepIcons = [
    { icon: Settings, label: "Service Details" },
    { icon: ImageIcon, label: "Upload Image" },
    { icon: MapPin, label: "Location & Schedule" },
  ];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/get_active_services`);
      
      const result = await response.json();
      if (result.success && result.data) {
        const options = result.data.map(service => ({
          value: service._id,           // Use the unique ID as value
          label: service.serviceName,
        }));
        setGetServices(options);
      } else {
        // If API fails, show sample data
        toast('Using sample data - API returned no data');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast('Using sample data - API not available');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url);
        return { file, url: imageUrl };
      });
    }
  };

  const getHumanReadableAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      return data.display_name || "Unknown Location";
    } catch (error) {
      console.error("Error fetching address:", error.message);
      return "Unknown Location";
    }
  };

  const handleLocationChange = async (selectedLocation) => {
    setLocation(selectedLocation);

    if (selectedLocation.value === "current") {
      if (!navigator.geolocation) {
        setCustomLocation("Geolocation not supported");
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });

        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        const address = await getHumanReadableAddress(latitude, longitude);
        setCustomLocation(address);
      } catch (error) {
        console.error("Error getting location:", error);
        setCustomLocation("Unknown Location");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!description || !time || !date || !pincode) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    if (
      (!location && !customLocation) ||
      (!service && !customService && !defaultService)
    ) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("user", auth.user._id);
    // formData.append(
    //   "service",
    //   isCustomService
    //     ? customService
    //     : defaultService
    //     ? defaultService.value
    //     : service?.value
    // );
    if (isCustomService) {
      formData.append("service", customService);
    } else {
      const selected = defaultService || service;
      formData.append("service", selected.label);
      formData.append("serviceId", selected.value);
    }
    formData.append("description", description);
    formData.append("image", image?.file || null);
    formData.append("time", time);
    formData.append("date", date);
    formData.append(
      "location",
      location?.value === "current" || isCustomLocation
        ? customLocation
        : location?.value
    );
    formData.append("pincode", pincode);
    formData.append("city", city);
    formData.append("coordinates", JSON.stringify(coordinates));
    formData.append("workerid", workerId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/CreateRequest`,
        { method: "POST", body: formData }
      );
      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        handleNext();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
    } finally {
      setLoading(false);
    }
  };

  const IconComponent = stepIcons[activeStep]?.icon;
  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <Toaster position="bottom-center" reverseOrder={false} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Service Request
          </h1>
          {workerId && workerName && (
            <div className="flex items-center justify-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border">
              <span className="text-gray-600">Hiring</span>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/GetWorkerImage/${workerId}`}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-gray-900">{workerName}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepIcons.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    index <= activeStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-sm mt-2 font-medium transition-colors duration-300 ${
                    index <= activeStep ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {activeStep === steps.length ? (
          /* Success State */
          <Card className="text-center py-12">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Request Submitted Successfully!
                </h2>
                <p className="text-gray-600">
                  Your service request has been created and sent to the service
                  provider.
                </p>
              </div>
             
              <Link href="/user/view_request">
                <Button size="lg" className="px-8">
                  View My Requests
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Form Steps */
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {IconComponent && <IconComponent className="h-5 w-5" />}
                {steps[activeStep]}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Service Details */}
                {activeStep === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="service">Service Type</Label>
                      <Select
                        id="service"
                        options={getServices}
                        isDisabled={defaultService || isCustomService}
                        value={defaultService || service}
                        onChange={setService}
                        placeholder="Select a service..."
                        classNamePrefix="select"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="text-amber-700 font-medium">
                        Need a custom service?
                      </span>
                      <Button
                        type="button"
                        variant={isCustomService ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setIsCustomService(!isCustomService)}
                      >
                        {isCustomService ? "Cancel" : "Add Custom"}
                      </Button>
                    </div>

                    {isCustomService && (
                      <div className="space-y-2">
                        <Label htmlFor="customService">Custom Service</Label>
                        <Input
                          id="customService"
                          value={customService}
                          onChange={(e) => setCustomService(e.target.value)}
                          placeholder="Describe your custom service need..."
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="description">Problem Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe your problem in detail..."
                        className="min-h-[120px] resize-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Image Upload */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Upload an image to help us better understand your
                        request (optional)
                      </p>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center gap-4"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              Click to upload image
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </label>
                      </div>

                      {image && (
                        <div className="mt-6 relative inline-block">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt="Upload preview"
                            className="max-w-full h-auto max-h-64 rounded-lg shadow-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                            onClick={() => setImage(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Location & Schedule */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Location Details
                        </h3>

                        <div className="space-y-2">
                          <Label>Service Location</Label>
                          <Select
                            options={locations}
                            isDisabled={isCustomLocation}
                            value={location}
                            onChange={handleLocationChange}
                            placeholder="Select location..."
                            classNamePrefix="select"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-blue-700 text-sm font-medium">
                            Different location?
                          </span>
                          <Button
                            type="button"
                            variant={
                              isCustomLocation ? "destructive" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setIsCustomLocation(!isCustomLocation)
                            }
                          >
                            {isCustomLocation ? "Cancel" : "Custom"}
                          </Button>
                        </div>

                        {isCustomLocation && (
                          <Input
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            placeholder="Enter custom location..."
                          />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                              id="pincode"
                              type="text"
                              maxLength={6}
                              value={pincode || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,6}$/.test(value)) {
                                  Setpincode(value);
                                }
                              }}
                              placeholder="000000"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>City</Label>
                            <Select
                              options={cityOptions}
                              value={cityOptions.find((c) => c.value === city)}
                              onChange={(selected) =>
                                Setcity(selected?.value || "")
                              }
                              placeholder="Select city..."
                              classNamePrefix="select"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Schedule
                        </h3>

                        <div className="space-y-2">
                          <Label>Preferred Date</Label>
                          <DatePicker
                            selected={date}
                            onChange={(date) => setdate(date)}
                            minDate={minDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select date..."
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="time">Preferred Time</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start pl-10 text-left"
                                id="time"
                              >
                                <Clock className="text-gray-400" />
                                {time || "Select time"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="max-h-64 overflow-y-auto p-0">
                              {timeOptions.map((t) => (
                                <Button
                                  key={t}
                                  variant="ghost"
                                  className="w-full justify-start rounded-none px-4"
                                  onClick={() => settime(t)}
                                >
                                  {t}
                                </Button>
                              ))}
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <div className="flex gap-2">
                    {activeStep === 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleNext}
                      >
                        Skip
                      </Button>
                    )}

                    <Button
                      type={
                        activeStep === steps.length - 1 ? "submit" : "button"
                      }
                      onClick={
                        activeStep === steps.length - 1
                          ? handleSubmit
                          : handleNext
                      }
                      disabled={loading}
                      className="flex items-center gap-2 min-w-[120px]"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : activeStep === steps.length - 1 ? (
                        <>
                          Submit Request
                          <CheckCircle className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserPrivateRoutes(CreateRequest);
