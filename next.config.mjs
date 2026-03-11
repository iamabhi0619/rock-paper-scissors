/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages for custom server
  serverExternalPackages: ['socket.io'],
  allowedDevOrigins: ['http://localhost:3000', 'https://client.iamabhi.me', 'https://10.121.162.173:3000'],
};

export default nextConfig;
