"use client";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useAuth } from "@/app/_context/UserAuthContent";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Pagination from "@mui/material/Pagination";
import { GetAcceptedByData } from "../_FetchFunction/AcceptedByData";
import { PulseLoader } from "react-spinners";

import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useParams } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { StyledTableCell, StyledTableRow } from "../../../_Arrays/Arrays";
import moment from "moment";

function AcceptedBy() {
  const [auth] = useAuth();
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { rid } = useParams();
  const currentDate = new Date();

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
  };

  async function fetchData() {
    if (loading) return;

    try {
      setLoading(true);
      const info = await GetAcceptedByData(rid, pageNumber);

      if (info.success) {
        setData(info.requests);
        setPages(Math.ceil(info.total / 5));
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
    } finally {
      setLoading(false);
    }
  }
  function CheckDateExpired(visitingDate) {
    const today = new Date();
    return visitingDate < today;
  }

  async function AssignTask(e, wid) {
    e.preventDefault();
    try {
      setLoading2(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/AssignRequest/${rid}/${wid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: currentDate,
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
      toast.error("error try again");
    } finally {
      setLoading2(false);
      fetchData();
    }
  }

  useEffect(() => {
    if (auth?.user?._id && pageNumber) {
      fetchData();
    }
  }, [pageNumber, auth?.user?._id]);

  return (
    <div className="container mx-auto p-4">
      <Toaster position="bottom-center" reverseOrder={false} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PulseLoader size={20} />
        </div>
      ) : data.length > 0 ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Requests Accepted By
          </Typography>
          {data[0].assignedTo ? (
            <Alert severity="info" className="my-4">
              {data[0].status === "Completed"
                ? "This request was completed!"
                : "This request is already assigned to a worker."}
            </Alert>
          ) : data[0].status === "Deleted" ? (
            <Alert severity="error" className="my-4">
              This request was deleted.
            </Alert>
          ) : null}
          <TableContainer className="mt-6">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Worker Name</StyledTableCell>
                  <StyledTableCell align="center">
                    Estimated Price
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Price Justification
                  </StyledTableCell>
                  <StyledTableCell align="center">Accepted At</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((request) =>
                  request.acceptedBy.map((accepted) => (
                    <StyledTableRow key={accepted.worker.Name}>
                      <StyledTableCell align="center">
                        {accepted.worker.Name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {accepted.estimatedPrice} Rs
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {accepted.priceJustification ? (
                          accepted.priceJustification
                        ) : (
                          <span className="text-red-600">Not provided</span>
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {moment(accepted.acceptedAt).format(
                          "MMMM Do YYYY, h:mm A"
                        )}
                      </StyledTableCell>
                      <StyledTableCell className="!flex justify-center gap-2">
                        {request.assignedTo ? null : data[0].status ===
                          "Deleted" ? null : (
                          <Button
                            title="assign this job to this worker"
                            onClick={() => {
                              if (!CheckDateExpired(data.date)) {
                                handleOpen();
                              } else {
                                toast.error(
                                  "the visiting date is expired please reschedule this request"
                                );
                              }
                            }}
                          >
                            Assign
                          </Button>
                        )}

                        <Link
                          href={`/worker/worker_profile/${accepted.worker._id}`}
                        >
                          {" "}
                          <Button>View profile</Button>
                        </Link>

                        {/* modal */}
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="Assign modal"
                          aria-describedby="used t o assign task to the worker "
                        >
                          <Box sx={style} className="flex flex-col gap-2 ">
                            <p className="text-center">
                              Confirm Request Assignment !
                            </p>
                            <p className="text-center text-red-600">
                              Please check all the details before assigning the
                              task to the worker once assigned you cannot revert
                              this action!
                            </p>

                            {data[0].status === "Deleted" ||
                            data[0].status === "Completed" ? null : (
                              <Button
                                title="assign this job to this worker"
                                onClick={(e) => {
                                  AssignTask(e, accepted.worker._id);
                                  if (!loading2) {
                                    handleClose();
                                  }
                                }}
                              >
                                Assign
                              </Button>
                            )}
                            <Button onClick={handleClose}>Close</Button>
                          </Box>
                        </Modal>
                        {/* backdrop */}
                        <Backdrop
                          sx={(theme) => ({
                            color: "#fff",
                            zIndex: theme.zIndex.drawer + 1,
                          })}
                          open={loading2}
                        >
                          <CircularProgress color="inherit" />
                        </Backdrop>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center my-6">
            <Pagination
              count={pages}
              page={pageNumber}
              color="primary"
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <Typography variant="h5" className="mb-4">
            No Data
          </Typography>
          <Image src="/Empty.svg" alt="No Data" width={300} height={300} />
          <Link href="/">
            <Button variant="contained" color="primary" className="mt-4">
              Go Home
            </Button>
          </Link>
        </div>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading2}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default AcceptedBy;
