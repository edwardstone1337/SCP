import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.scp-reader.co' }],
        destination: 'https://scp-reader.co/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
