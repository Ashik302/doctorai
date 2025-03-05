import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  const allowedDomains = ["localhost:3000"];

  try {
    await axios.get(`${req.nextUrl.origin}/api/appointment`);
  } catch (error) {
    console.error("Error in middleware while checking appointments:", error.message || error);
  }

  try {
    const response = await axios.get(`${req.nextUrl.origin}/api/subdomainDoctorAuth`);
    if (response.status !== 200) {
      console.error("Failed to fetch subdomain data:", response.status);
      return NextResponse.json({ status: 500, message: "Failed to fetch subdomain data" }, { status: 500 });
    }

    const subdomains: string[] = response.data.subdomains || [];
    const isAllowedDomain = allowedDomains.some((domain) => hostname?.includes(domain));
    const subdomain = hostname?.split(".")[0];
    const isSubdomain = subdomains.includes(subdomain || "");

    if (isAllowedDomain && !isSubdomain) {
      return NextResponse.next();
    }

    if (isSubdomain) {
      const subdomainData = subdomains.find((domain) => domain === subdomain);
      if (subdomainData) {
        return NextResponse.rewrite(new URL(`/doctor/${subdomain}${url.pathname}`, req.url));
      }
    }

    console.log("No matching subdomain found. Redirecting to 404...");
    return NextResponse.redirect(new URL(`/404`, req.nextUrl));
  } catch (error) {
    console.error("Error in middleware:", error.message || error);
    return NextResponse.json(
      {
        status: 500,
        message: "Error fetching doctor data",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
