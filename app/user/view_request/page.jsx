"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Toaster, toast } from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PulseLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { StyledTableCell, StyledTableRow } from "../../_Arrays/Arrays";
import { useAuth } from "@/app/_context/UserAuthContent";
import UserPrivateRoutes from "../../_components/privateroutes/UserPrivateRoutes";


function ViewRequest() {
  const [auth, setauth] = useAuth();
  const [data, setdata] = useState([]);
  const [pages, SetPages] = useState(1);
  const [pageNumber, SetPageNumber] = useState(1);
  const [loading, setloading] = useState(false);
  const currentDate = new Date();
  const handlePageChange = (event, value) => {
    SetPageNumber(value);
  };

  async function GetData() {
    try {
      setloading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetUserRequest/${auth?.user?._id}/${pageNumber}`
      );
      const info = await response.json();
      if (response.status === 200) {
        setdata(info.requests);
        SetPages(Math.ceil(info.totalRequests / 5));
        setloading(false);
      } else if (response.status === 404) {
        setloading(false);
      } else {
        toast.error(info.message);
        setloading(false);
      }
    } catch (error) {
      toast.error("please try again");
      setloading(false);
    }
  }

  useEffect(() => {
    if (auth?.user?._id && pageNumber) {
      GetData();
    }
  }, [pageNumber, auth]);

  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={false} />
      {loading ? (
        <div className="h-[600px] w-full  flex  ">
          <PulseLoader size={20} className="m-auto" />
        </div>
      ) : data?.length > 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-3xl text-center sm:mt-3  mt-20 font-bold">
            Requests Created By You
          </p>
          <TableContainer className="cursor-pointer sm:mt-5  mt-10 m-auto   justify-center flex flex-col  pb-3 ">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Service type</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">
                    Visiting Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((data, index) => (
                  <StyledTableRow key={data._id || index}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {data.service}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {data.location}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {moment(data.date).format("MMMM Do YYYY")}{" "}
                        </span>
                        {new Date(data.date) < currentDate &&
                        data.status !== "Completed" &&
                        data.status !== "Deleted" ? (
                          <span className="text-red-500">(Date Expired)</span>
                        ) : null}
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
}

export default UserPrivateRoutes(ViewRequest);
