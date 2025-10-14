"use client";
import React from "react";
import moment from "moment";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


const Ratings = ({ Reviews }) => {
  return (
    <div
      className="mt-8 mb-20 w-full flex flex-col items-center justify-center "
      id="reviews"
    >
      <p className="text-xl font-bold tracking-wide text-center">All Reviews</p>

      <Swiper
        effect={"coverflow"}
        centeredSlides={true}
        slidesPerView={3}
        navigation={true}
        grabCursor={true}
        loop={true}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          modifier: 0,
          slideShadows: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        breakpoints={{
          0: { slidesPerView: 1 },
          480: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1440: { slidesPerView: 1 },
        }}
        className="mt-5 w-[90%] lg:w-1/2 m-auto"
      >
        {Reviews?.map((data, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <div className="flex flex-col items-start  bg-white p-3 rounded-lg shadow-lg m-auto w-[90%] md:w-[450px]">
              <div className="flex items-center gap-2">
                <Avatar
                  alt={data.user || "User"}
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/GetUserImage/${data?.user?._id}`}
                />
                <div>
                  <p className="font-semibold">
                    {data.user.Name || "Anonymous"}
                  </p>
                  <p>{data.userRole || "User"}</p>
                </div>
              </div>
              <div className="mt-3">
                <Rating
                  name="half-rating-read"
                  defaultValue={data.stars || 0}
                  precision={0.5}
                  readOnly
                />
                <p>{data.comment || "No comment provided."}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {moment(data.date || new Date()).format("MMMM Do, YYYY")}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Ratings;
