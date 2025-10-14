"use client";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  MdVerifiedUser,
  MdOutlineLocationOn,
  MdFilterList,
  MdClear,
} from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { Tag } from "antd";
import toast, { Toaster } from "react-hot-toast";
import UserPrivateRoutes from "@/app/_components/privateroutes/UserPrivateRoutes";

const Hire = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [getServices, setGetServices] = useState([]);
  const [ServiceType, setServiceType] = useState("");
  // const [WorkerCoordinates, setWorkerCoordinates] = useState(null);

  const [backdrop, setBackDrop] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/get_active_services`);
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const options = result.data.map(service => ({
          value: service._id,
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

  // Function to get user location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const coordinates = { latitude, longitude };
            localStorage.setItem(
              "userCoordinates",
              JSON.stringify(coordinates)
            );
            resolve(coordinates);
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            resolve(null);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        resolve(null);
      }
    });
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);

      // Get stored coordinates
      let coordinates = JSON.parse(localStorage.getItem("userCoordinates"));
      const auth = JSON.parse(localStorage.getItem("auth"));
      const pincode = auth?.user?.Pincode;
      if (!coordinates) {
        coordinates = await getUserLocation();
      }
      fetchWorkers(coordinates, pincode);
    };

    initializeData();
  }, [currentPage, ServiceType]);

  // Fetch workers only after coordinates are available
  const fetchWorkers = async (coordinates, pincode) => { 
 
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/ListWorkers/${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Pincode: pincode,
            ServiceType: ServiceType,
            Coordinates: {
              coordinates: [coordinates.longitude, coordinates.latitude],
            },
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setWorkers(data.Workers);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("No workers found");
        setWorkers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 mb-8 shadow-sm">
        <h1 className="text-center font-bold text-3xl md:text-4xl text-gray-800 mb-2">
          Hire Service Providers
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Find and hire skilled professionals in your area for all your service
          needs
        </p>
      </div>

      <Toaster position="top-right" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <MdFilterList className="text-lg" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters */}
        <div
          className={`lg:w-1/4 ${showFilters ? "block" : "hidden"} lg:block`}
        >
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              {ServiceType && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  onClick={() => setServiceType("")}
                >
                  <MdClear /> Clear
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <Select
                  required
                  onValueChange={handleServiceTypeChange}
                  value={ServiceType}
                >
                  <SelectTrigger className="w-full border-gray-200 rounded-lg bg-white">
                    <SelectValue placeholder="Select a Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {[
                      "Electrician",
                      "Carpenter",
                      "Plumber",
                      "Painter",
                      "Gardener",
                      "Mechanic",
                      "Locksmith",
                      "Handyman",
                      "Welder",
                      "Pest Control",
                      "Roofer",
                      "Tiler",
                      "Appliance Repair",
                      "Flooring Specialist",
                    ].map((service) => (
                      <SelectItem key={service} value={service.toLowerCase()}>
                        {service}
                      </SelectItem>
                    ))} */}

                    {getServices.map((service) => (
                      <SelectItem key={service.value} value={service.label}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {ServiceType && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                    <span className="text-sm font-medium">Active filter:</span>
                    <Chip
                      label={ServiceType}
                      size="small"
                      onDelete={() => setServiceType("")}
                      color="primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Providers */}
        <div className="lg:w-3/4 flex flex-col">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : workers?.length > 0 ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  Found <span className="font-medium">{workers.length}</span>{" "}
                  service providers
                </p>
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              <div className="space-y-6 mb-6">
                {workers.map((worker) => (
                  <div
                    key={worker._id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <Avatar
                          alt={worker.Name}
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/GetWorkerImage/${worker._id}`}
                          sx={{ width: 80, height: 80 }}
                          className="rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-semibold">
                              {worker.Name}
                            </h3>
                            {worker.Verified?.verified === "Verified" && (
                              <Chip
                                icon={
                                  <MdVerifiedUser className="text-green-600" />
                                }
                                label="Verified"
                                size="small"
                                color="success"
                                className="h-6"
                              />
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Rating
                              name="read-only"
                              value={worker.OverallRaitngs || 0}
                              readOnly
                              precision={0.5}
                              size="small"
                            />
                            <span className="text-sm">
                              {worker.OverallRaitngs}{" "}
                              <span className="text-gray-400">
                                ({worker?.ReviewsCount || 0} reviews)
                              </span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Chip
                              label={worker.ServiceType}
                              size="small"
                              color="primary"
                              variant="outlined"
                              className="h-6"
                            />

                            {worker.city && (
                              <div className="flex items-center text-gray-500 gap-1 text-sm">
                                <MdOutlineLocationOn className="text-gray-500" />
                                {worker.city}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      {worker?.SubSerives?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 mb-2">
                            Specializations:
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {worker.SubSerives.map((sub, index) => (
                              <Chip
                                key={index}
                                label={sub}
                                variant="outlined"
                                size="small"
                                className="h-6"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-gray-100 my-4"></div>

                      {/* Other Details */}
                      <div className="flex justify-between items-center flex-wrap gap-3">
                        <div className="flex items-center">
                          <Tag color="blue" className="mr-2">
                            Completed Jobs:{" "}
                            <span className="font-medium">
                              {worker.CompletedRequest || 0}
                            </span>
                          </Tag>
                        </div>

                        <div className="flex gap-3">
                          <Link href={`/worker/worker_profile/${worker._id}`}>
                            <Button variant="outline" size="sm" className="h-9">
                              View Profile
                            </Button>
                          </Link>
                          <Link
                            href={`/user/create_request?id=${encodeURIComponent(
                              worker?._id
                            )}&name=${encodeURIComponent(
                              worker?.Name
                            )}&expertise=${encodeURIComponent(
                              worker?.ServiceType
                            )}`}
                          >
                            <Button
                              className="flex items-center gap-2 h-9"
                              size="sm"
                            >
                              <FaHandshake className="text-sm" />
                              Hire
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 mb-8">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </div>
            </>
          ) : (
            <div className="bg-slate-50 rounded-xl p-10 text-center">
              <p className="text-gray-500 text-lg mb-2">
                No service providers found
              </p>
              <p className="text-gray-400">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </div>
      </div>
      {/* backdrop */}
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default UserPrivateRoutes(Hire);
