"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/_context/UserAuthContent";
import { FetchCompletedRequest } from "../_FetchFunction/FetchCompletedRequests";
import moment from "moment";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { PulseLoader } from "react-spinners";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { StyledTableCell, StyledTableRow } from "../../../_Arrays/Arrays";

const CompletedRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth, SetAuth] = useAuth();
  const [error, setError] = useState(null);
  const [pages, SetPages] = useState(1);
  const [pageNumber, SetPageNumber] = useState(1);

  const handlePageChange = (event, value) => {
    SetPageNumber(value);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await FetchCompletedRequest(auth?.user?._id, pageNumber);
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
      {loading ? (
        <div className="h-[600px] w-full  flex  ">
          <PulseLoader size={20} className="m-auto" />
        </div>
      ) : requests?.length > 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-3xl text-center sm:mt-3  mt-5 font-bold">
            Requests Completed By You
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
                    <StyledTableCell align="center">
                      <Link href={`Request_Details/${data._id}`}>
                        <Button>View</Button>
                      </Link>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
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
            alt="Empty"
            height={400}
          />
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CompletedRequest;
