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
}

module.exports = nextConfig