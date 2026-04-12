/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["unicornstudio-react"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
