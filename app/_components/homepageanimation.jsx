"use client";
import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LottieAnimation = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; 

  return (
    <DotLottieReact
      src="https://lottie.host/bf9750c3-8c66-4641-a213-da2eea812c93/DyZztCGG34.lottie"
      loop
      autoplay
    />
  );
};

export default LottieAnimation;
