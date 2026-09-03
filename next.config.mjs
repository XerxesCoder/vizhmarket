/** @type {import('next').NextConfig} */

const nextConfig = {
  cacheComponents: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "m.media-amazon.com" }] },
};

export default nextConfig;
