import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const baseApiUrl = process.env.REST_API_URL || "http://localhost:8000";

    // Get the session token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isUserInGroup = token?.groups_direct.includes("ska-telescope");
    if (!isUserInGroup) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    // Check if the request path starts with /proxy/api
    if (url.pathname.startsWith("/proxy/api")) {
        const newUrl = `${baseApiUrl}${url.pathname.replace("/proxy/api", "/api")}${url.search}`;
        // Create a new response with the updated URL and headers
        const response = NextResponse.rewrite(newUrl);

        // Add headers if the required env variables are set
        if (process.env.REST_API_TOKEN_HEADER && process.env.REST_API_TOKEN_SECRET) {
            response.headers.set(process.env.REST_API_TOKEN_HEADER, process.env.REST_API_TOKEN_SECRET);
        }

        return response;
    }

    return NextResponse.next();
}

// Apply middleware only to requests that match the API route
export const config = {
    matcher: "/proxy/api/:path*",
};