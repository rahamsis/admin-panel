/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Tus dominios propios
      {
        protocol: "https",
        hostname: "importonyperu.local",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "importonyperu.com.pe",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "depsac.com.pe",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cygrefrisac.com.pe",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lezcor.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oishipop.com.pe",
        pathname: "/**",
      },
      // Cloudflare R2
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // ajusta según necesidad
    },
    // Añadir esto para evitar el warning Cross origin
    allowedDevOrigins: (() => {
      if (process.env.NODE_ENV !== "development") return [];
      const localDomains = [
        "localhost",
        "127.0.0.1",
        "admin.depsac.local",
        "importonyperu.local",
        "cygrefrisac.local",
      ];
      return localDomains.flatMap((domain) => [
        `http://${domain}:3000`,
        `https://${domain}`,
      ]);
    })(),
  },
};

module.exports = nextConfig;