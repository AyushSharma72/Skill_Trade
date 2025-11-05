
// Added by refactor: alias @ to /src
import path from 'path';
const _addAlias = (config) => { config = config || {}; config.experimental = config.experimental || {}; config.webpack = (config.webpack || ((c)=>c)); const old = config.webpack; config.webpack = (c, opts) => { c.resolve = c.resolve || {}; c.resolve.alias = Object.assign(c.resolve.alias || {}, {'@': path.resolve(__dirname, 'src')}); return old(c, opts); }; return config; };

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
