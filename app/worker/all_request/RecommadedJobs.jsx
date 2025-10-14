"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

import Divider from "@mui/material/Divider";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {useAuth} from "../../_context/UserAuthContent"

const RecommadedJobs = () => {
  const [auth, SetAuth] = useAuth();
  const [jobs, SetJobs] = useState([]);
  const [error, SetError] = useState(false);

  async function fetchRecommandedForYou() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/RecommandedForYou/${auth?.user?._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        SetError(true);
        return;
      }
      const data = await response.json();
      if (data.success) {
        SetJobs(data.requests);
      } else {
        SetError(true);
      }
    } catch (error) {
      SetError(true);

      console.log(error);
    }
  }

  useEffect(() => {
    if (auth?.user?._id) {
      fetchRecommandedForYou();
    }
  }, [auth?.user?._id]);

  return (
    <div className="mt-5 p-4">
      <p className="text-center text-2xl font-semibold">Recommended for you</p>
      {error ? (
        <div className="text-red-500 text-center h-[100px] mt-10">
          There was an error loading jobs
        </div>
      ) : jobs?.length > 0 ? (
        <Swiper
          effect={"coverflow"}
          slidesPerView={1}
          navigation={true}
          grabCursor={true}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            modifier: 0,
            slideShadows: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1440: { slidesPerView: 2, spaceBetween: 30 },
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="mt-5 w-full m-auto"
        >
          {jobs?.map((data, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-start  p-4 rounded-lg shadow-lg  m-auto border-2">
                <div className="font-bold">{data.service}</div>
                <Divider className="w-full mb-2" />
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Location:</span>{" "}
                  {data.location}, {data.city}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Visiting Time:</span>{" "}
                  {data.time}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Visiting Date:</span>{" "}
                  {moment(data.date || new Date()).format("MMMM Do, YYYY")}
                </p>
                <Divider className="w-full !mt-2" />
                <Link href={`Request_Details/${data._id}`}>
                  <p className="mt-2 text-blue-500 flex items-center gap-1">
                    View Details <FaChevronRight />
                  </p>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center mt-10 text-2xl">No jobs found ☹️</p>
      )}
    </div>
  );
};

export default RecommadedJobs;
