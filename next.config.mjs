/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skill-trade-backend.onrender.com",
        pathname: "/**",   // allow all subpaths like /uploads/*
      },
      {
        protocol: "https",
        hostname: "skill-trade-next-15.vercel.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
