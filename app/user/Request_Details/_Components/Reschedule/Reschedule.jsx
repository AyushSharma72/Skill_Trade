"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UpdateRequest from "../../_FetchFunction/EditRequest";
import { useParams } from "next/navigation";
import Image from "next/image";

const Reschedule = ({ intialData }) => {
  const [loading, setLoading] = useState(false);
  const minDate = new Date();
  const [date, setdate] = useState(intialData.date);
  const [time, settime] = useState(intialData.time);
  const [address, setAddress] = useState(intialData.location);
  const [pincode, Setpincode] = useState(intialData.pincode);
  const [status, SetStatus] = useState(intialData.status);
  const { rid } = useParams();

  async function Update(e) {
    e.preventDefault();
    if (!time && !date && !address && !pincode) {
      toast.error("please enter atleast one field");
      return;
    }
    if (pincode.toString().length !== 6) {
      toast.error("Please enter a valid pincode");
      return;
    }

    setLoading(true);
    try {
      const response = await UpdateRequest(date, time, address, pincode, rid);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {status === "Completed" || status === "Deleted" ? (
        <div className="flex flex-col justify-center items-center w-full ">
          <p className="text-2xl font-semibold mt-10 text-center">
            {`You cannot reschedule because this request was ${
              status === "Completed" ? "completed" : "deleted"
            }`}
          </p>
          <Image
            src="/requestcompletedimage.svg"
            className="lg:w-[400px] lg:h-[400px] w-[200px] h-[200px] md:w-[300px] md:h-[300px]"
            width={400}
            alt="Empty"
            height={400}
          />
        </div>
      ) : (
        <div className="flex-col flex justify-around items-center sm:flex-col md:flex-row p-3">
          <Toaster position="bottom-center" reverseOrder={false} />
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <Image
            src="/reschedule.svg"
            className="lg:w-[400px] lg:h-[400px] w-[200px] h-[200px] md:w-[300px] md:h-[300px]"
            width={400}
            height={400}
            alt="Reschedule image"
          />
          <div className="w-full sm:w-[90%] lg:w-1/2">
            <p className="font-bold text-2xl text-center">Reschedule Request</p>

            <form
              onSubmit={Update}
              className="flex justify-center flex-col items-center gap-y-5 mt-5 formshadow py-5 rounded-md"
            >
              <div className="w-full flex flex-col gap-2 justify-center items-center">
                <label
                  className="block mb-2 font-medium text-start w-3/4"
                  htmlFor="date"
                >
                  Edit Date
                </label>
                <div className="w-3/4">
                  <DatePicker
                    id="date"
                    onChange={(date) => setdate(date)}
                    selected={date}
                    className="border border-gray-300 w-64  p-2 rounded-md"
                    placeholderText="Select date"
                    minDate={minDate}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-2 justify-center items-center">
                <label
                  className="block mb-2 font-medium text-start w-3/4"
                  htmlFor="time"
                >
                  Edit Time
                </label>
                <input
                  id="time"
                  type="time"
                  className="p-2 border-2 border-gray-300 rounded-md w-3/4 cursor-pointer"
                  value={time}
                  onChange={(e) => settime(e.target.value)}
                  placeholder="Select time"
                />
              </div>

              <div className="w-full flex flex-col gap-2 justify-center items-center">
                <label
                  className="block mb-2 font-medium text-start w-3/4"
                  htmlFor="Address"
                >
                  Edit Address
                </label>
                <TextField
                  id="Address"
                  label="Edit Address"
                  variant="outlined"
                  className="w-3/4"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  name="Address"
                />
              </div>
              <div className="w-full flex flex-col gap-2 justify-center items-center">
                <label
                  className="block mb-2 font-medium text-start w-3/4"
                  htmlFor="Pincode"
                >
                  Edit Pincode
                </label>
                <TextField
                  id="Pincode"
                  label="Edit Pincode"
                  variant="outlined"
                  className="w-3/4"
                  type="number"
                  value={pincode}
                  onChange={(e) => Setpincode(e.target.value)}
                  name="Pincode"
                />
              </div>

              <Button type="submit">Reschedule</Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Reschedule;
