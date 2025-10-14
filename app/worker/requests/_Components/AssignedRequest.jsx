"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/_context/UserAuthContent";
import { FetchAssignedRequest } from "../_FetchFunction/FetchAssignedRequest";
import moment from "moment";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { PulseLoader } from "react-spinners";
import Link from "next/link";
import Image from "next/image";
import { Backdrop } from "@mui/material";
import { Button } from "@/components/ui/button";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Textarea } from "@mui/joy";
import {
  StyledTableCell,
  StyledTableRow,
  style,
} from "../../../_Arrays/Arrays";
import toast, { Toaster } from "react-hot-toast";

const AssignedRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth, SetAuth] = useAuth();
  const [error, setError] = useState(null);
  const [pages, SetPages] = useState(1);
  const [pageNumber, SetPageNumber] = useState(1);
  const [unassignModal, SetunassignModal] = useState(false);
  const [description, setDescription] = useState("");
  const [backdrop, setBackDrop] = useState(false);

  const handlePageChange = (event, value) => {
    SetPageNumber(value);
  };

  const handleOpen = () => {
    SetunassignModal(true);
  };

  const handleChange = (event) => {
    if (event.target.value.length <= 100) {
      setDescription(event.target.value);
    }
  };

  async function UnAssign(rid) {
    try {
      setBackDrop(true);
      const currentdate = new Date();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/UnassignRequest/${rid}/${auth?.user._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: description,
            date: currentdate,
          }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("error making this request");
    } finally {
      setBackDrop(false);
      SetunassignModal(false);
      setDescription("");
    }
  }

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await FetchAssignedRequest(auth?.user?._id, pageNumber);
        setRequests(data.data);
        SetPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.user?._id) {
      fetchRequests();
    }
  }, [auth?.user?._id, pageNumber]);

  return (
    <div>
      {backdrop && <Backdrop />}
      {loading ? (
        <div className="h-[600px] w-full  flex  ">
          <PulseLoader size={20} className="m-auto" />
        </div>
      ) : requests?.length > 0 ? (
        <div className="flex flex-col items-center">
          <Toaster position="bottom-center" reverseOrder={false} />
          <p className="text-3xl text-center sm:mt-3  mt-5 font-bold">
            Requests Assigned To You
          </p>
          <TableContainer className="cursor-pointer sm:mt-5  mt-5 m-auto   justify-center flex flex-col  pb-3">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Service type</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">
                    Visiting Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">
                    Assigned Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((data, index) => (
                  <StyledTableRow key={data._id || index}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {data.service}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {data.location}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {" "}
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {moment(data.date).format("MMMM Do YYYY")}
                        </span>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {data.status === "Pending" ? (
                        <Tag icon={<ClockCircleOutlined />} color="warning">
                          {data.status}
                        </Tag>
                      ) : data.status === "Accepted" ? (
                        <Tag icon={<CheckCircleOutlined />} color="blue">
                          {data.status}
                        </Tag>
                      ) : data.status === "Assigned" ? (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          {data.status}
                        </Tag>
                      ) : data.status === "Completed" ? (
                        <Tag icon={<CheckCircleOutlined />} color="purple">
                          {data.status}
                        </Tag>
                      ) : data.status === "Deleted" ? (
                        <Tag icon={<CheckCircleOutlined />} color="red">
                          {data.status}
                        </Tag>
                      ) : null}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {moment(data.confirmedAt).format("MMMM Do YYYY")}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <div className="flex gap-2">
                        {" "}
                        <Link href={`Request_Details/${data._id}`}>
                          <Button>View</Button>
                        </Link>
                        <Button onClick={handleOpen}>Unassign Me</Button>
                      </div>
                    </StyledTableCell>

                    {/* modal  */}
                    <Modal
                      open={unassignModal}
                      onClose={() => {
                        SetunassignModal(false);
                      }}
                    >
                      <Box sx={style} className="flex flex-col gap-1">
                        <p className="font-bold text-center">
                          Are you sure you want to unassign yourself ?<br></br>
                          <span className="!text-red-600">
                            Warning: your profile may get banned for unassigning
                            yourself multiple times without solid reason.
                          </span>
                        </p>{" "}
                        <div>
                          {" "}
                          <Textarea
                            name="description"
                            placeholder="Type reason"
                            value={description}
                            onChange={handleChange}
                            className="w-full h-20 overflow-y-scroll scrollbar-hide"
                            required
                          />
                          <p className="text-gray-400">
                            {100 - description.length} characters remaining
                          </p>
                        </div>
                        <Button
                          onClick={(e) => {
                            UnAssign(data._id);
                          }}
                        >
                          Unassign
                        </Button>
                        <Button
                          onClick={() => {
                            SetunassignModal(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Modal>
                  </StyledTableRow>
                ))}
                {/* unasssign me modal  */}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            className="mt-5"
            count={pages}
            page={pageNumber}
            color="primary"
            onChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <p className="font-bold text-3xl text-center mt-10">No Data</p>
          <Image
            src="/Empty.svg"
            className="w-[400px] h-[400px] m-auto"
            width={400}
            height={400}
            alt="Empty"
          />
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AssignedRequest;
