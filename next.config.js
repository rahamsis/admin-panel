/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com", 'importonyperu.local', 'importonyperu.com.pe', 'depsac.com.pe', 'lezcor.com'],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.r2.cloudflarestorage.com",
                pathname: "/**",
            },
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // o '50mb' según lo que necesites
        },
    }
}

module.exports = nextConfig