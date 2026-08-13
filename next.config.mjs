/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  // Pin workspace root so Next doesn't pick a parent lockfile it might find.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
