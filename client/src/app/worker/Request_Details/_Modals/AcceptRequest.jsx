"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Input, Textarea } from "@mui/joy";
import { Button } from "../../../../components/ui/button";
import { AcceptRequestFetchFunction } from "../_FetchFunction/AcceptRequest";
import { toast } from "react-hot-toast";
import { style } from "../../../_Arrays/Arrays";
import { Backdrop } from "@mui/material";

const AcceptRequest = ({ handleClose, rid }) => {
  const [EstimatedPrice, SetEstimatedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [backdrop, setBackDrop] = useState(false);

  const currentDate = new Date();

  async function AcceptRequestFunction() {
    try {
      if (!EstimatedPrice) {
        toast.error("price is missing");
        return;
      }
      setBackDrop(true);
      const authString = localStorage.getItem("auth");
      const auth = JSON.parse(authString);
      const data = await AcceptRequestFetchFunction(
        auth?.user?._id,
        rid,
        EstimatedPrice,
        description,
        currentDate
      );

      if (data.success) {
        toast.success(data.message);
        handleClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error while reporting:", error);
      toast.error(
        "An error occurred while submitting the report. Please try again."
      );
    } finally {
      setBackDrop(false);
    }
  }

  if (backdrop) {
    return <Backdrop />;
  }
  return (
    <Box sx={style} className="w-[320px] sm:w-[400px]">
      <p className="w-full text-center mb-2 text-2xl font-bold">
        Accept Request
      </p>
      <div className="flex flex-col items-center justify-center gap-3">
        <Input
          type="number"
          name="Estimated Price"
          value={EstimatedPrice}
          onChange={(e) => SetEstimatedPrice(e.target.value)}
          placeholder="Enter estimated price in Rs"
          className="w-full"
          required
        />
        <Textarea
          name="description"
          placeholder="justify your price (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-40 overflow-y-scroll scrollbar-hide"
        />
        <div className="flex  flex-col gap-1 w-full">
          {" "}
          <Button
            onClick={() => {
              AcceptRequestFunction();
            }}
          >
            Accept Request
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default AcceptRequest;
