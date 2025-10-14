"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/_context/UserAuthContent";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Pagination,
} from "@mui/material";
import { Tag } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { StyledTableCell, StyledTableRow } from "../../_Arrays/Arrays";

const HiringRequest = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const fetchHiringRequests = async () => {
      if (!auth?.user?._id) return;
      setLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/HiringRequest/${auth.user._id}?page=${pageNumber}&limit=5`
        );
        if (!response) {
          throw new Error(
            "No response from server. Please check your internet connection."
          );
        }
        const result = await response.json();
        if (response.ok) {
          setData(result.hiringRequests);
          setTotalPages(result.totalPages);
        } else {
          switch (response.status) {
            case 400:
              toast.error("Bad request. Please check the input.");
              break;
            case 401:
              toast.error("Unauthorized. Please log in again.");
              break;
            case 500:
              toast.error("Server error. Please try again later.");
              break;
            default:
              toast.error(result.message || "An unexpected error occurred.");
          }
        }
      } catch (error) {
        toast.error(
          error.message || "Something went wrong while fetching requests."
        );
      }

      setLoading(false);
    };

    if (auth) {
      fetchHiringRequests();
    } else {
      const storedAuth = JSON.parse(localStorage.getItem("auth"));
      if (storedAuth) {
        setAuth(storedAuth);
      }
    }
  }, [auth, pageNumber]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={false} />
      {loading ? (
        <p className="text-2xl text-center mt-10">Loading...</p>
      ) : data.length > 0 ? (
        <div className="flex flex-col justify-center items-center  mt-20 sm:mt-0">
          <p className="text-3xl mt-5 leading-6">Hiring requests</p>
          <TableContainer className="cursor-pointer sm:mt-5 mt-10 m-auto justify-center flex flex-col pb-3">
            <Table aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Description</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">
                    Visiting Date
                  </StyledTableCell>

                  <StyledTableCell align="center">Status</StyledTableCell>

                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {data.map((item, index) => (
                  <StyledTableRow key={item._id || index}>
                    <StyledTableCell align="center">
                      {item.description.substring(0, 50)}...
                    </StyledTableCell>
                    {/* address */}
                    <StyledTableCell align="center">
                      <a
                        href={
                          item.coordinates?.coordinates?.length === 2
                            ? `https://www.google.com/maps?q=${item.coordinates.coordinates[1]},${item.coordinates.coordinates[0]}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                item.location
                              )}`
                        }
                        target="_blank"
                        className="text-blue-500"
                      >
                        {item.location.substring(0, 50)}...
                      </a>
                    </StyledTableCell>
                    {/* visiting date  */}
                    <StyledTableCell align="center">
                      {moment(item.visitingDate).format("MMMM Do YYYY")}
                      <br></br>
                      at {item.time}
                    </StyledTableCell>

                    {/* status  */}
                    <StyledTableCell align="center">
                      {item.status === "Pending" ? (
                        <Tag icon={<ClockCircleOutlined />} color="warning">
                          {item.status}
                        </Tag>
                      ) : item.status === "Accepted" ? (
                        <Tag icon={<CheckCircleOutlined />} color="blue">
                          {item.status}
                        </Tag>
                      ) : item.status === "Rejected" ? (
                        <Tag icon={<CheckCircleOutlined />} color="red">
                          {item.status}
                        </Tag>
                      ) : item.status === "Completed" ? (
                        <Tag icon={<CheckCircleOutlined />} color="purple">
                          {item.status}
                        </Tag>
                      ) : item.status === "Assigned" ? (
                        <Tag icon={<CheckCircleOutlined />} color="green">
                          {item.status}
                        </Tag>
                      ) : null}
                    </StyledTableCell>

                    {/* creation date  */}
                    <StyledTableCell align="center">
                      {item?.user?.Name} on <br></br>
                      {moment(item.Creationdate).format("MMMM Do YYYY")}
                    </StyledTableCell>
                    {/* contact  */}
                    <StyledTableCell
                      align="center"
                      className="gap-2 !flex justify-center"
                    >
                      <Link href={`/worker/Request_Details/${item._id}`}>
                        <Button>view</Button>
                      </Link>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            className="mt-5"
            count={totalPages}
            page={pageNumber}
            color="primary"
            onChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="w-full flex-col gap-5 justify-center flex h-[500px] items-center mt-10">
          <Image src="/Empty.svg" height={400} width={400} alt="Empty"></Image>
          <p className="text-2xl">No, Hiring request for you </p>
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HiringRequest;
