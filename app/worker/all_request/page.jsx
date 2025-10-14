"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { TbFilterSearch } from "react-icons/tb";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StyledTableCell,
  StyledTableRow,
  calculateDistance,
  marks,
} from "../../_Arrays/Arrays";
import { GetRequestFilteredData } from "./GetRequestFilteredData";
import RecommadedJobs from "./RecommadedJobs";
import SmallScreennmodal from "./SmallScreenmodal";
import { useAuth } from "@/app/_context/UserAuthContent";

function ViewRequest() {
  const [auth] = useAuth();
  const [data, setdata] = useState([]);
  const [pages, setPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [checkedValues, setCheckedValues] = useState({
    nearBy: false,
    yourCity: false,
  });
  const [disabled, setDisabled] = useState(null);
  const [open, setOpen] = useState(false);
  const [workerCoordinates, setWorkerCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [alertShow, setAlertShow] = useState(true);
  const [distance, setDistance] = useState(5);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Get user location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            localStorage.setItem(
              "userCoordinates",
              JSON.stringify({ latitude, longitude })
            );
          },
          (error) => {
            console.error("Error fetching location:", error.message);
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.");
      }
    };

    getUserLocation();
    const userCoordinates = JSON.parse(localStorage.getItem("userCoordinates"));
    if (userCoordinates) {
      setWorkerCoordinates({
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
      });
    }
  }, []);

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  async function getData() {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/Allrequests/${pageNumber}`
      );
      const info = await response.json();
      if (info.success) {
        setdata(info.requests);
        setPages(Math.ceil(info?.totalrequests / 5));
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("please try again");
    } finally {
      setLoading(false);
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/get_active_services`
      );
      const result = await response.json();

      if (result.success && result.data) {
        const options = result.data.map((service) => ({
          value: service._id,
          label: service.serviceName,
          subServices: service.subServices || [],
        }));
        setServices(options);
      } else {
        toast("Using sample data - API returned no data");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast("Using sample data - API not available");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const checkCity = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/CheckCity/${auth?.user?._id}`
      );
      const data = await response.json();
      setDisabled(!data.success);
    } catch (error) {
      console.error("Error checking city:", error);
      setDisabled(false);
    }
  };

  async function getFilteredData() {
    try {
      setLoading(true);
      const info = await GetRequestFilteredData(
        serviceType,
        checkedValues,
        distance,
        auth?.user?._id,
        workerCoordinates
      );
      if (info.success) {
        setdata(info.requests);
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("please try again");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setCheckedValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (serviceType || checkedValues.nearBy || checkedValues.yourCity || distance) {
      getFilteredData();
      checkCity();
    } else {
      getData();
      checkCity();
    }
  }, [pageNumber, auth, serviceType, checkedValues, distance]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="flex flex-col lg:flex-row gap-6 p-5">
        {/* Filters */}
        <div className="lg:w-1/4 flex flex-col gap-6 mt-20 sm:mt-0">
          <span
            className="flex sm:hidden lg:flex items-center gap-2 font-bold cursor-pointer hover:text-blue-600 transition"
            onClick={handleOpen}
          >
            <TbFilterSearch className="text-lg" />
            Apply Filters
            {serviceType && <Tag>{serviceType}</Tag>}
            {checkedValues.yourCity && <Tag>Your City</Tag>}
          </span>

          <SmallScreennmodal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            handleServiceTypeChange={handleServiceTypeChange}
            ServiceType={serviceType}
            handleChange={handleChange}
            Disabled={disabled}
            checkedValues={checkedValues}
            distance={distance}
            setDistance={setDistance}
          />

          {/* Service Type Filter */}
          <div className="hidden sm:flex flex-col gap-4 p-4 bg-white shadow rounded-xl">
            <p className="font-semibold text-gray-700">Service Type</p>
            <Select onValueChange={handleServiceTypeChange} value={serviceType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.value} value={service.label}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setServiceType("")}>Clear</Button>
          </div>

          {/* Location Filter */}
          <div className="hidden sm:flex flex-col gap-4 p-4 bg-white shadow rounded-xl">
            <p className="font-semibold text-gray-700">Location</p>
            <p className="text-sm text-gray-600">Distance range in kms</p>
            <Box>
              <Slider
                aria-label="Distance"
                value={distance}
                onChange={(e, newValue) => setDistance(newValue)}
                valueLabelDisplay="auto"
                step={5}
                marks={marks}
                min={0}
                max={20}
                sx={{
                  color: "black",
                  "& .MuiSlider-thumb": { backgroundColor: "black" },
                  "& .MuiSlider-track": { backgroundColor: "black" },
                  "& .MuiSlider-rail": { backgroundColor: "gray" },
                }}
              />
            </Box>
            <FormControlLabel
              name="yourCity"
              control={<Checkbox disabled={disabled} />}
              label="Your City"
              checked={checkedValues.yourCity}
              onChange={handleChange}
            />
            {disabled && (
              <p className="text-sm text-red-500">
                Update your city to enable this filter.
              </p>
            )}
            <Button
              onClick={() => {
                setCheckedValues({ nearBy: false, yourCity: false });
                setDistance(5);
              }}
            >
              Clear Location
            </Button>
          </div>
        </div>

        {/* Data Section */}
        <div className="lg:w-3/4 w-full">
          {loading ? (
            <div className="h-[500px] flex justify-center items-center">
              <PulseLoader size={20} />
            </div>
          ) : data?.length > 0 ? (
            <>
              <p className="text-2xl text-center font-bold mb-4">All Requests</p>
              {workerCoordinates.latitude && alertShow ? (
                <Alert
                  severity="info"
                  onClose={() => setAlertShow(false)}
                  className="mb-4"
                >
                  You are sharing your location for better search results!
                </Alert>
              ) : alertShow ? (
                <Alert
                  severity="info"
                  onClose={() => setAlertShow(false)}
                  className="mb-4"
                >
                  Allow location in browser site settings to display distance!
                </Alert>
              ) : null}

              <TableContainer component={Paper} className="shadow">
                <Table aria-label="requests table" sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Service</StyledTableCell>
                      <StyledTableCell align="center">Location</StyledTableCell>
                      <StyledTableCell align="center">Visiting Date</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                      <StyledTableCell align="center">Distance</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <StyledTableRow key={row._id}>
                        <StyledTableCell align="center">{row.service}</StyledTableCell>
                        <StyledTableCell align="center">{row.location}</StyledTableCell>
                        <StyledTableCell align="center">
                          {moment(row.date).format("MMMM Do YYYY")}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.status === "Pending" && (
                            <Tag icon={<ClockCircleOutlined />} color="warning">
                              {row.status}
                            </Tag>
                          )}
                          {row.status === "Accepted" && (
                            <Tag icon={<CheckCircleOutlined />} color="blue">
                              {row.status}
                            </Tag>
                          )}
                          {row.status === "Assigned" && (
                            <Tag icon={<CheckCircleOutlined />} color="success">
                              {row.status}
                            </Tag>
                          )}
                          {row.status === "Completed" && (
                            <Tag icon={<CheckCircleOutlined />} color="purple">
                              {row.status}
                            </Tag>
                          )}
                          {row.status === "Deleted" && (
                            <Tag icon={<CheckCircleOutlined />} color="red">
                              {row.status}
                            </Tag>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {workerCoordinates.latitude &&
                          row.coordinates?.coordinates[1]
                            ? `${calculateDistance(
                                workerCoordinates.latitude,
                                workerCoordinates.longitude,
                                row.coordinates?.coordinates[1],
                                row.coordinates?.coordinates[0]
                              )} km`
                            : <span className="text-red-500">Not available</span>}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Link href={`Request_Details/${row._id}`}>
                            <Button>View</Button>
                          </Link>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {!serviceType && !checkedValues.nearBy && !checkedValues.yourCity && (
                <Pagination
                  className="mt-4 flex justify-center"
                  count={pages}
                  page={pageNumber}
                  color="primary"
                  onChange={handlePageChange}
                />
              )}
              <RecommadedJobs />
            </>
          ) : (
            <div className="flex flex-col justify-center items-center text-center">
              <p className="font-bold text-2xl mt-10">No Data</p>
              <Image
                src="/Empty.svg"
                width={400}
                height={400}
                alt="Empty"
                className="my-4"
              />
              <Link href="/">
                <Button>Home</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewRequest;
