module.exports = {
  experimental: {
    optimizeCss: false,
  },
  redirects: async () => [
    {
      source: "/:path*",
      destination: "https://www.advisa.io/:path*",
      permanent: true,
    },
  ],
};
