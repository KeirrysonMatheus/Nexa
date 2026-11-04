import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
	async headers() {
		const securityHeaders = [
			{
				key: "Content-Security-Policy",
				value: [
					"default-src 'self'",
					"base-uri 'self'",
					"object-src 'none'",
					"frame-ancestors 'none'",
					"form-action 'self'",
					"script-src 'self' 'unsafe-inline'",
					"style-src 'self' 'unsafe-inline'",
					"img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.googleusercontent.com",
					"font-src 'self' data:",
					"connect-src 'self' https://accounts.google.com",
					"frame-src 'self' https://accounts.google.com",
				].join("; "),
			},
			{ key: "X-Content-Type-Options", value: "nosniff" },
			{ key: "X-Frame-Options", value: "DENY" },
			{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
			{
				key: "Permissions-Policy",
				value: "camera=(), microphone=(), geolocation=()",
			},
			...(process.env.NODE_ENV === "production"
				? [
						{
							key: "Strict-Transport-Security",
							value: "max-age=31536000; includeSubDomains",
						},
					]
				: []),
		]

		return [{ source: "/(.*)", headers: securityHeaders }]
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.public.blob.vercel-storage.com",
			},
			{
				protocol: "https",
				hostname: "*.googleusercontent.com",
			},
		],
	},
}

export default nextConfig
