"use client";
import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Image from "next/image";
import Link from "next/link";
import {
  Typography,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Modal,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { Button } from "../../../components/ui/button";
import { RxCross1 } from "react-icons/rx";
import { StyledTableCell, StyledTableRow, style } from "../../_Arrays/Arrays";
import isAdmin from "@/app/_components/privateroutes/isAdmin";
import { Textarea } from "@mui/joy";
import toast,{ Toaster } from "react-hot-toast";


const Page = ({ role }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedId, SetSelectedId] = useState(null);
  const [backdrop, SetBackDrop] = useState(false);
 
  const fetchPageData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/get_verifying_requests?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchPageData(page);
  };

  const handleOpenModal = (wid) => {
    setSelectedImage(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/get_veriify_id/${wid}`
    );
    setImageLoading(true);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setOpenModal(false);
  };

  const handleRejectRequest = async () => {
    if (rejectionReason.length < 30) {
      toast.error("reason cannot be less than 30 characters");
      return;
    }
    try {
      SetBackDrop(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/reject_verification_request/${selectedId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: rejectionReason,
            role: role,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast("the request was rejected");
        fetchPageData(currentPage);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error rejecting request");
    } finally {
      setOpenRejectModal(false);
      SetBackDrop(false);
    }
  };

  const verifyWorker = async (wid) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/verify_worker/${wid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("error try again");
    } finally {
      SetBackDrop(false);
    }
  };

  useEffect(() => {
    fetchPageData(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4 sm:m-0 mt-20">
      <Toaster position="bottom-center" reverseOrder={false} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PulseLoader size={20} />
        </div>
      ) : requests && requests.length > 0 ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Pending Verification Requests
          </Typography>
          <TableContainer className="mt-6">
            <Table aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Worker Name</StyledTableCell>
                  <StyledTableCell align="center">Mobile No</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">View ID</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {requests.map((request, index) => (
                  <StyledTableRow key={request._id || index}>
                    <StyledTableCell align="center">
                      <Link
                        href={`/worker/worker_profile/${request._id}`}
                        className="text-blue-600"
                      >
                        {request.Name}
                      </Link>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {request.MobileNo || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {request.Verified.verified || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => handleOpenModal(request._id)}>
                        View ID
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => {
                            verifyWorker(request._id);
                          }}
                        >
                          Verify
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-500"
                          onClick={() => {
                            setOpenRejectModal(true);
                            SetSelectedId(request._id);
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
            No pending verification requests.
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

      {/* Modal for Viewing ID */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Worker ID</DialogTitle>
        <RxCross1
          className="absolute top-5 right-2 cursor-pointer"
          onClick={handleCloseModal}
        />
        <DialogContent>
          {imageLoading && (
            <div className="flex justify-center my-4 gap-2 text-lg">
              Loading <PulseLoader size={15} />
            </div>
          )}
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="ID"
              width={500}
              height={500}
              onLoadingComplete={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal for Rejection */}
      <Modal
        open={openRejectModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="sm:w-[400px] w-[300px] flex flex-col gap-2 !p-4"
        >
          <Typography
            id="modal-modal-title"
            className="text-center"
            variant="h6"
            component="h2"
          >
            Are you sure? <br></br>this action is not reversible
          </Typography>

          <Textarea
            name="rejection"
            placeholder="Give a reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full h-40 overflow-y-scroll scrollbar-hide"
            required
          />
          <div className="flex justify-around  flex-col mt-2 gap-1">
            <Button
              onClick={() => {
                handleRejectRequest();
              }}
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                setOpenRejectModal(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default isAdmin(Page);
