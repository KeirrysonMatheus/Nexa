import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
	async headers() {
		const oneSignalCsp = [
			"default-src 'self'",
			"base-uri 'self'",
			"object-src 'none'",
			"frame-ancestors 'none'",
			"form-action 'self'",
			"script-src 'self' 'unsafe-inline' https://cdn.onesignal.com https://onesignal.com",
			"worker-src 'self' https://cdn.onesignal.com blob:",
			"child-src 'self' https://cdn.onesignal.com blob:",
			"style-src 'self' 'unsafe-inline' https://onesignal.com",
			"img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.googleusercontent.com https://onesignal.com https://*.onesignal.com",
			"font-src 'self' data:",
			"connect-src 'self' https://accounts.google.com https://onesignal.com https://*.onesignal.com https://*.os.tc",
			"frame-src 'self' https://accounts.google.com https://onesignal.com https://*.onesignal.com",
		].join("; ")

		const securityHeaders = [
			{
				key: "Content-Security-Policy",
				value: oneSignalCsp,
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

		const serviceWorkerHeaders = [
			{
				key: "Content-Type",
				value: "application/javascript; charset=utf-8",
			},
			{ key: "Service-Worker-Allowed", value: "/" },
			{
				key: "Cache-Control",
				value: "public, max-age=0, must-revalidate",
			},
			{
				key: "Content-Security-Policy",
				value: [
					"default-src 'self'",
					"script-src 'self' https://cdn.onesignal.com",
					"connect-src 'self' https://onesignal.com https://*.onesignal.com https://*.os.tc",
					"img-src 'self' data: https://onesignal.com https://*.onesignal.com",
				].join("; "),
			},
		]

		return [
			{
				source: "/OneSignalSDKWorker.js",
				headers: serviceWorkerHeaders,
			},
			{
				source: "/OneSignalSDKUpdaterWorker.js",
				headers: serviceWorkerHeaders,
			},
			{ source: "/(.*)", headers: securityHeaders },
		]
	},
	images: {
		unoptimized: true,
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
