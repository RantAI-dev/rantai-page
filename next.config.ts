import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "biz-merger.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "trpl.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dsar.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sdpr.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mlvr.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lmvr.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dlvr.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mmdr.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "smart-scm.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sscm.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rlvr.rantai.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
