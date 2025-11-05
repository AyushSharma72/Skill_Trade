"use client";
import React, { useEffect, useState,use } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";
import dynamic from "next/dynamic";
import toast,{Toaster} from "react-hot-toast";

// UI Components
import { Tag, Image } from "antd";
import { Button } from "../../../../../components/ui/button";
import { Textarea, Input } from "@mui/joy";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Icons

import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  MdOutlineHandyman,
  MdOutlineAssignmentTurnedIn,
  MdOutlineTextSnippet,
} from "react-icons/md";
import { FaLocationDot, FaCalendarCheck, FaAddressCard } from "react-icons/fa6";
import { SiStatuspage } from "react-icons/si";
import { TbMapPinCode } from "react-icons/tb";
import StarIcon from "@mui/icons-material/Star";

// Utility Functions
import { DeleteRequestFetchFunction } from "../../_FetchFunction/DeleteRequest";
import { CompleteRequest } from "../../_FetchFunction/CompleteRequest";
import { UnAssign } from "../../_FetchFunction/UnassignWorker";

// Context & Constants
import { useAuth } from "@/app/_context/UserAuthContent";
import { labels, style } from "../../../../_Arrays/Arrays";

const RequestDetails = ({ initialData, intialimage }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
const params = useParams();
 const rid = params?.rid;
  const [image, setImage] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [completed, SetCompleted] = useState(false);
  const [reviewmodal, setReviewModal] = useState(false);
  const router = useRouter();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [auth, setAuth] = useAuth();
  const [price, SetPrice] = useState(null);
  const [comment, SetComment] = useState("");
  const [stars, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [unassignModal, SetunassignModal] = useState(false);
  const [description, setDescription] = useState("");
  const [dateExpiredModal, SetdateExpiredModal] = useState(false);
  const [imageUrl, setImgUrl] = useState(intialimage);
  const [imageError, setImageError] = useState(false);    
  const [selectedImageName, setSelectedImageName] = useState('');    

  function getLabelText(stars) {
    return `${stars} Star${stars !== 1 ? "s" : ""}, ${labels[stars]}`;
  }
  const handleChange = (event) => {
    if (event.target.value.length <= 100) {
      setDescription(event.target.value);
    }
  };

  async function HandleCompleteRequest(wid) {
    try {
      const uid = auth?.user?._id;
      if (stars === 0) {
        toast.error("please give stars");
      }
      if (!price || !comment) {
        toast.error("price and comment are required");
      }
      if (!uid) {
        toast.error("user is missing try agian later");
      }
      setFetchLoading(true);
      const response = await CompleteRequest(
        rid,
        uid,
        wid,
        comment,
        price,
        stars
      );
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      // removed console.log for production

      toast.error("error try again");
    } finally {
      setFetchLoading(false);
    }
  }

  async function UnassignWorker(e, wid) {
    e.preventDefault();
    if (!description || description.length < 30) {
      toast.error("please give description of atleast 30 characters");
      return;
    }
    try {
      setFetchLoading(true);
      const response = await UnAssign(rid, wid, description);
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // removed console.log for production

      toast.error("error making this request");
    } finally {
      SetunassignModal(false);
      setDescription("");
      GetData();
      setFetchLoading(false);
    }
  }

  async function updateRequestImage(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (!image) {
        toast.error("please select an image");
        return;
      }
      formData.append("image", image);
      setFetchLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/UpdateRequestPhoto/${rid}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Photo updated successfully!");
        SetImgUrl(`${imageurl}?timestamp=${new Date().getTime()}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      // removed console.log for production

    } finally {
      setFetchLoading(false);
    }
  }

  async function DeleteRequest() {
    try {
      setFetchLoading(true);
      const response = await DeleteRequestFetchFunction(rid);
      if (response.success) {
        toast.success(response.message);
        router.push("/user/view_request");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error try again");
    } finally {
      setFetchLoading(false);
    }
  }

  async function GetData() {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetSingleUserRequest/${rid}`
      );
      const info = await response.json();
      if (info.success) {
        setImgUrl(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetRequestPhotoController/${rid}`
        );
        setData(info.requestdetails);
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("Please try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (data) {
      if (
        new Date(data.date) < new Date() &&
        data.status != "Completed" &&
        data.status != "Deleted"
      ) {
        SetdateExpiredModal(true);
      }
    }
  }, []);

  async function RequestReview(rid) {
    try {
      setFetchLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/review_request/${rid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("error try again later");
    } finally {
      setReviewModal(false);
      GetData();
      setFetchLoading(false);
    }
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setSelectedImageName(e.target.files[0].name);
  };

  const handleCommentChange = (event) => {
    if (event.target.value.length <= 200) {
      SetComment(event.target.value);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center sm:px-4 py-2">
      <Toaster position="bottom-center" reverseOrder={false} />
      <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={fetchLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <h2 className="text-4xl font-bold mb-2 text-center">Request Details</h2>

      {data?.ReportedInfo?.Info && !data?.ReportedInfo?.Review ? (
        <Alert severity="warning" className="w-full max-w-2xl mb-4">
          <strong>Warning:</strong> Please follow the guidelines below, or your
          request may be deleted.
          <br /> {data?.ReportedInfo?.Info}
          <span
            onClick={() => setReviewModal(true)}
            className="ml-3 text-blue-600 cursor-pointer"
          >
            Request Review
          </span>
        </Alert>
      ) : data?.ReportedInfo?.Review ? (
        <Alert severity="info" className="w-full max-w-2xl mb-4">
          Request submitted for review
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ display: "flex" }} className="mt-5">
          <CircularProgress />
        </Box>
      ) : (
        <div className="w-full max-w-6xl bg-white rounded-lg sm:p-6 p-2">
          {data && (
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex flex-col items-center w-full lg:w-1/3">
                {(imageError) ?
                  <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 text-sm">
                    <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-10 w-10 mb-2"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M3 7l9-4 9 4v10l-9 4-9-4V7z"
  />
</svg>

                    <span>No Image Uploaded</span>
                  </div>
                  : 
                  <Image
                    src={imageUrl}
                    width={200}
                    height={200}
                    onError={()=>{
                      setImageError(true)
                    }}
                    className="object-cover rounded-md !h-64 !w-[330px] m-auto"
                    alt="Request Image"
                  />
                }
                {data.status !== "Completed" && data.status !== "Deleted" && (
                  <form className="flex flex-col w-full mt-4 gap-4">
                    <div>
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 cursor-pointer transition"
                      >
                        📁 Choose Image
                      </label>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {selectedImageName && (
                        <p className="text-xs text-gray-500 mt-1">
                          Selected: <span className="font-medium">{selectedImageName}</span>
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        updateRequestImage(e);
                      }}
                    >
                      Update Photo
                    </Button>
                  </form>
                )}
              </div>

              <div className="w-full lg:w-2/3 flex flex-col gap-3 p-4 border rounded-lg">
                {/* service type */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 font-semibold sm:text-lg sm:w-1/3">
                    <MdOutlineHandyman /> Service type:
                  </span>
                  <p>{data.service}</p>
                </div>
                <hr />
                {/* description  */}
                <div className="flex items-center  gap-2">
                  <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                    <MdOutlineTextSnippet /> Description:
                  </span>
                  <p className="text-base">{data.description}</p>
                </div>
                <hr />
                {/* address */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                    {" "}
                    <FaAddressCard /> Address:
                  </span>
                  <p>{data.location}</p>
                </div>
                <hr />
                {/* pincode  */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                    <TbMapPinCode /> Pincode:
                  </span>
                  <p className="text-base">{data.pincode}</p>
                </div>
                <hr />
                {/* city  */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                    <FaLocationDot /> City:
                  </span>
                  <p className="text-base">{data.city}</p>
                </div>
                <hr />
                {/* visiting date  */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                    <FaCalendarCheck /> Visiting Date:
                  </span>
                  <p className="text-base">
                    {data.date ? (
                      <>
                        {moment(data.date).format("MMMM Do YYYY")} at{" "}
                        {data.time}
                      </>
                    ) : (
                      "No date available"
                    )}
                  </p>
                </div>
                <hr />
                {/* status  */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                    <SiStatuspage /> Status:
                  </span>
                  <div>
                    {data.status === "Pending" ? (
                      <Tag icon={<ClockCircleOutlined />} color="warning">
                        Pending
                      </Tag>
                    ) : data.status === "Accepted" ? (
                      <Tag icon={<CheckCircleOutlined />} color="blue">
                        Accepted
                      </Tag>
                    ) : data.status === "Assigned" ? (
                      <Tag icon={<CheckCircleOutlined />} color="green">
                        Assigned
                      </Tag>
                    ) : data.status === "Completed" ? (
                      <Tag icon={<CheckCircleOutlined />} color="purple">
                        Completed
                      </Tag>
                    ) : (
                      <Tag icon={<CheckCircleOutlined />} color="red">
                        {data.status}
                      </Tag>
                    )}
                  </div>
                </div>
                <hr />
                {/* assignes to  */}
                {data.assignedTo && (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 font-semibold text-lg sm:w-1/3">
                      <MdOutlineAssignmentTurnedIn className="text-xl" />{" "}
                      Assigned to:
                    </span>

                    <Link
                      href={`/worker/worker_profile/${data.assignedTo?._id}`}
                    >
                      <span className=" text-blue-600 cursor-pointer">
                        {data.assignedTo?.Name}
                      </span>
                    </Link>
                  </div>
                )}
                {data.status !== "Completed" && data.status !== "Deleted" ? (
                  <div className="flex gap-1 justify-around sm:flex-row flex-col">
                    {data.status === "Pending" ||
                    data.status === "Accepted" ? null : (
                      <Button
                        className="w-full sm:w-1/2"
                        onClick={() => {
                          SetCompleted(true);
                        }}
                      >
                        Mark as completed
                      </Button>
                    )}
                    <Button onClick={handleOpen} className="w-full sm:w-1/2">
                      Delete request
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
          {/* modal */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={style}
              className="flex flex-col gap-2 w-[300px] sm:w-[400px]"
            >
              <p className="font-bold text-center">
                Are you sure you want to delete this request ?
              </p>{" "}
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  DeleteRequest();
                }}
              >
                Delete
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </Box>
          </Modal>

          {/* mark as completed modal  */}
          <Modal
            open={completed}
            onClose={() => {
              SetCompleted(false);
            }}
          >
            <Box
              sx={style}
              className="flex flex-col gap-2 sm:w-[400px] w-[310px]"
            >
              <p className="text-center font-semibold">
                Rate you experience with the worker
              </p>
              <hr />
              <div className="flex flex-col gap-1">
                <label className="text-sm m-0 font-medium text-gray-700">
                  Rating
                </label>{" "}
                <div className="flex">
                  {" "}
                  <Rating
                    name="hover-feedback"
                    value={stars}
                    precision={1}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  {stars !== null && (
                    <Box sx={{ ml: 2 }}>
                      {labels[hover !== -1 ? hover : stars]}
                    </Box>
                  )}
                </div>
              </div>

              <div>
                {" "}
                <label
                  htmlFor="description"
                  className="text-sm m-0 font-medium text-gray-700"
                >
                  Comment
                </label>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Add comment"
                  value={comment ?? ""}
                  onChange={handleCommentChange}
                  className="w-full h-20 overflow-y-scroll scrollbar-hide"
                  required
                />
                <p className="text-gray-400">
                  {200 - comment.length} characters remaining
                </p>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="text-sm m-0 font-medium text-gray-700"
                >
                  Price charged by the worker
                </label>
                <Input
                  id="address"
                  name="address"
                  value={price ?? ""}
                  onChange={(e) => SetPrice(e.target.value)}
                  placeholder="Price"
                  type="number"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => {
                    HandleCompleteRequest(data.assignedTo._id);
                    SetCompleted(false);
                  }}
                >
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    SetCompleted(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Box>
          </Modal>

          {/* request review modal  */}
          <Modal open={reviewmodal}>
            <Box
              sx={style}
              className="flex flex-col gap-2 sm:w-[400px] w-[310px]"
            >
              <p className="text-center font-semibold">
                Make the changes before requesting review
              </p>
              <hr></hr>
              <div></div> {/* placeholder div */}
              <Button
                onClick={() => {
                  RequestReview(rid);
                }}
              >
                Request review
              </Button>
              <Button
                onClick={() => {
                  setReviewModal(false);
                }}
              >
                Cancel
              </Button>
              <hr />
            </Box>
          </Modal>

          {/* unassign modal  */}
          <Modal
            open={unassignModal}
            onClose={() => {
              SetunassignModal(false);
            }}
          >
            <Box
              sx={style}
              className="flex flex-col gap-2 sm:w-[400px] w-[310px]"
            >
              <p className="font-bold text-center">
                Are you sure you want to unassign this worker ?
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
                  UnassignWorker(e, data.assignedTo?._id);
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

          {/* {date expires}  */}
          <Modal
            open={dateExpiredModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={style}
              className="flex flex-col gap-2 sm:w-[400px] w-[300px] "
            >
              <p className="text-red-600 text-center">
                The visiting date for this request is expired please reschedule
                this request in the reschedule tab !
              </p>{" "}
              <Button
                onClick={() => {
                  SetdateExpiredModal(false);
                }}
              >
                Ignore
              </Button>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
