"use client";
import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Image from "next/image";
import Link from "next/link";
import {
  Typography,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Button } from "../../../components/ui/button";
import { MdDelete } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast, { Toaster } from "react-hot-toast";
import { StyledTableCell } from "../../_Arrays/Arrays";
import isAdmin from "@/app/_components/privateroutes/isAdmin";
import { Textarea } from "@mui/joy";

const Page = ({ role }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [backdrop, setBackdrop] = useState(false);
  const [openRows, setOpenRows] = useState({});
  const [infomodal, SetInfoModal] = useState(false);
  const [openmodal, SetOpenModal] = useState(false);
  const [rejectReviewModal, SetRejectReviewModal] = useState(false);
  const [requestId, SetRequestId] = useState("");
  const [info, SetInfo] = useState("");

  useEffect(() => {
    fetchPageData(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleToggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchPageData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/view_reports?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: 2 }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // toast.error(data.message);
      }
      if (data.success) {
        setReports(data.reports || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setReports([]);
        setTotalPages(1);
      }
    } catch (error) {
      setReports([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // delete request
  async function deleteRequest() {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/delete_request/${requestId}`;
    setBackdrop(true);
    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const result = await response.json();

      if (response.ok) {
        SetOpenModal(false);
        toast.success(result.message);
        fetchPageData(currentPage);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting");
    } finally {
      SetRequestId(null);
      setBackdrop(false); // Hide the backdrop
    }
  }

  // inform user
  async function informUser() {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/inform_user/${requestId}`;
    setBackdrop(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ info, role }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchPageData(currentPage);
        SetInfoModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An Error occurred");
    } finally {
      SetRequestId(null);
      setBackdrop(false); // Hide the backdrop
    }
  }

  // reject review

  async function rejectReviewRequest() {
    try {
      setBackdrop(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/reject_review/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      SetRequestId(null);
      setBackdrop(false); // Hide the backdrop
    }
  }

  // approve review
  async function approveRequest() {
    try {
      setBackdrop(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/approve_review/${requestId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      SetRequestId(null);
      setBackdrop(false); // Hide the backdrop
    }
  }

  return (
    <div className="mx-auto p-4 sm:m-0 mt-20">
      <Toaster position="bottom-center" reverseOrder={false} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PulseLoader size={20} />
        </div>
      ) : reports && reports.length > 0 ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Reported Requests
          </Typography>
          <TableContainer className="mt-6 mx-auto" component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  <StyledTableCell align="center">Request ID</StyledTableCell>
                  <StyledTableCell align="center">
                    Reports Count
                  </StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                  <StyledTableCell align="center">
                    Review Request
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <React.Fragment key={report._id}>
                    <TableRow>
                      <StyledTableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggleRow(report._id)}
                        >
                          {openRows[report._id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Link
                          href={`/worker/Request_Details/${report.requestId}`}
                          className="text-blue-700"
                        >
                          {report.requestId}
                        </Link>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {report.Report.length} times
                      </StyledTableCell>

                      {/* Actions */}
                      <StyledTableCell align="center">
                        <div className="flex gap-3 justify-center items-center">
                          {!report.ReviewRequested && (
                            <Tooltip title="Inform User">
                              <IoIosInformationCircle
                                className="text-xl cursor-pointer text-blue-700"
                                onClick={() => {
                                  SetRequestId(report.requestId);
                                  SetInfoModal(true);
                                }}
                              />
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Request">
                            <MdDelete
                              className="text-xl cursor-pointer text-red-600"
                              onClick={() => {
                                SetRequestId(report.requestId);
                                SetOpenModal(true);
                              }}
                            />
                          </Tooltip>
                        </div>
                      </StyledTableCell>

                      {/* Review Section */}
                      <StyledTableCell align="center">
                        {report.ReviewRequested ? (
                          <div className="flex gap-4 justify-center items-center">
                            <Button
                              title="Approve the review"
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                              onClick={() => {
                                SetRequestId(report.requestId);
                                if (requestId) {
                                  approveRequest();
                                }
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              title="Reject the review"
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                              onClick={() => {
                                SetRequestId(report.requestId);
                                SetRejectReviewModal(true);
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={5}
                      >
                        <Collapse
                          in={openRows[report._id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <div className="p-4">
                            <Typography variant="h6" gutterBottom>
                              Report Details
                            </Typography>
                            <Table size="small" aria-label="nested table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell align="center">
                                    Worker Name
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    Issue Type
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {report.Report.map((r) => (
                                  <TableRow key={r._id}>
                                    <StyledTableCell align="center">
                                      <Link
                                        href={`/worker/worker_profile/${r.worker._id}`}
                                        className="text-blue-600"
                                      >
                                        {r.worker.Name}
                                      </Link>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      {r.IssueType}
                                    </StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </Collapse>
                      </StyledTableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <Typography variant="h5" className="mb-4 text-center">
            No Reported Requests
          </Typography>
          <Image
            src="/Empty.svg"
            alt="No Data"
            width={500}
            height={400}
            className="sm:!w-[500px]  !w-[300px]"
          />
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      )}

      {/* Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div>
        {/* // deleteRequest dialog */}
        <AlertDialog open={openmodal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  SetOpenModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteRequest();
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/*informUser dialog */}

        <AlertDialog open={infomodal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Inform the user</AlertDialogTitle>
              <AlertDialogDescription>
                <Textarea
                  name="description"
                  placeholder="Inform the user about problem in the request"
                  value={info}
                  onChange={(e) => SetInfo(e.target.value)}
                  className="w-full h-40 overflow-y-scroll scrollbar-hide"
                  required
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                onClick={() => {
                  SetInfoModal(false);
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  informUser();
                }}
              >
                Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* // rejectReviewRequest dialog */}

        <AlertDialog open={rejectReviewModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Review Request</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject this review request? This action
                is irreversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  SetRejectReviewModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  rejectReviewRequest();
                }}
              >
                Reject
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default isAdmin(Page);
