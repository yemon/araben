/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable dynamic routes and API routes for trace game
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  // Pin workspace root so Next doesn't pick a parent lockfile it might find.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
