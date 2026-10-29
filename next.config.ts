import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // There is an unrelated package-lock.json in a parent directory on this
  // machine; without this, Next infers the workspace root as that parent and
  // traces far more files than it should.
  outputFileTracingRoot: __dirname,
  images: {
    // All catalogue imagery is served from /public/images — pre-resized and
    // pre-compressed at build time, so there is no runtime dependency on an
    // external image host and no cold-start latency waiting on one.
    //
    // When imagery moves to a DAM/CMS, add its host here as a remotePattern
    // rather than disabling the optimizer to work around config friction
    // (image-optimization skill, rule 7):
    //
    //   remotePatterns: [{ protocol: "https", hostname: "cdn.example.com" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
