"use client";
import React from "react";
import Lottie from "react-lottie";
import animationData from "./_Arrays/loading.json"

export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Lottie
        options={defaultOptions}
        height={150}
        width={200}
        isClickToPauseDisabled={true}
      />
      <p className="font-bold tracking-wider">LOADING.....</p>
    </div>
  );
}
