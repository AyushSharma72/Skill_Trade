"use client";
import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { FaCheck } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const TimeLine = ({ intialData, loadingstate }) => {
  const [data, setdata] = useState(intialData);
  const [loading, setloading] = useState(loadingstate);

  return (
    <>
      <p className="font-bold text-2xl text-center">Request Timeline</p>

      {loading ? (
        <Box sx={{ display: "flex" }} className="mt-5 w-full justify-center">
          <CircularProgress />
        </Box>
      ) : (
        <Timeline position="alternate">
          {/* Created */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="success">
                <FaCheck />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="h6" component="span">
                Request Created
              </Typography>
              <Typography>A request was created by you</Typography>
              <Typography>
                {data.date
                  ? moment(data.createdAt).format("MMMM Do YYYY, h:mm A")
                  : "No date available"}
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* pending  */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="warning">
                <FaRegClock />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="h6" component="span">
                Pending
              </Typography>
              <Typography>Waiting till someone accepts your request</Typography>
              <Typography>
                {data.date
                  ? moment(data.createdAt).format("MMMM Do YYYY, h:mm A")
                  : "No date available"}
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Accepted  */}
          {data.status !== "Pending" && data.acceptedBy.length > 0 ? (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="success">
                  <FaCheck />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  Accepted
                </Typography>
                <Typography>Request was accepted by a worker</Typography>
                <Typography>
                  {data.acceptedBy[0].acceptedAt
                    ? moment(data.acceptedBy[0].acceptedAt).format(
                        "MMMM Do YYYY, h:mm A"
                      )
                    : "No date available"}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ) : null}

          {/* Assigned  */}
          {data.confirmedAt ? (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="success">
                  <FaCheck />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  Assigned
                </Typography>
                <Typography>Accepted request was Assigned by you </Typography>
                <Typography>
                  {data.confirmedAt
                    ? moment(data.confirmedAt).format("MMMM Do YYYY, h:mm A")
                    : "No date available"}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ) : null}

          {/* completed  */}
          {data.status == "Completed" ? (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="success">
                  <FaCheck />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  Completed
                </Typography>
                <Typography>The request was completed </Typography>
                <Typography>
                  {data.completedAt
                    ? moment(data.completedAt).format("MMMM Do YYYY, h:mm A")
                    : "No date available"}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ) : null}

          {/* deleted  */}
          {data.status == "Deleted" ? (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="error">
                  <FaCheck />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  Deleted
                </Typography>
                <Typography>The request was deleted by you </Typography>
                <Typography>
                  {data.deletedAt
                    ? moment(data.deletedAt).format("MMMM Do YYYY, h:mm A")
                    : "No date available"}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ) : null}
        </Timeline>
      )}
    </>
  );
};

export default TimeLine;
