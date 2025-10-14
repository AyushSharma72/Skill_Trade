"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportRequest } from "../_FetchFunction/ReportRequest";
import { toast } from "react-hot-toast";
import {style} from "../../../_Arrays/Arrays"


const ReportModal = ({ handleClose, rid }) => {
  const [IssueType, SetIssueType] = useState("");

  const handleIssueTypeChange = (value) => {
    SetIssueType(value);
  };

  async function Report() {
    try {
      if(!IssueType){
        toast.error("please select an issue")
        return;
      }
      const authString = localStorage.getItem("auth");
      const auth = JSON.parse(authString);
      const data = await ReportRequest(
        auth?.user?._id,
        rid,
        IssueType,
      );

      if (data.success) {
        toast.success(data.message);
        handleClose();
        SetIssueType("");

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error while reporting:", error);
      toast.error(
        "An error occurred while submitting the report. Please try again."
      );
    }
  }

  return (
    <Box sx={style} className="w-[320px] sm:w-[400px]">
      <p className="w-full text-center mb-2 text-2xl font-bold">
        Report request
      </p>
      <div className="flex flex-col items-center justify-center gap-3">
        <Select
          required
          onValueChange={(value) => handleIssueTypeChange(value)}
          value={IssueType || undefined}
        
        >
          <SelectTrigger>
            <SelectValue placeholder="Select issue" />
          </SelectTrigger>
          <SelectContent className="z-[1500]">
            <SelectItem value="The request is irrelevent">
              The request is irrelevent
            </SelectItem>
            <SelectItem value="the image is irrelevent">
              the image is irrelevent
            </SelectItem>
            <SelectItem value="Description and other details are not proper">
              Description and other details are not proper
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="w-full flex flex-col gap-2 ">
          {" "}
          <Button
            onClick={() => {
              Report();
            }}
          >
            Submit Report
          </Button>
          <Button onClick={handleClose}>Close</Button>{" "}
        </div>
      </div>
    </Box>
  );
};

export default ReportModal;
