import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "fail";
  const bookingId = searchParams.get("bookingId") || "";
  const paidBy = searchParams.get("paidBy") || "";
  const tranId = searchParams.get("tranId") || "";

  const origin = req.headers.get("origin") || "http://localhost:3000";
  const redirectUrl = `${origin}/services?paymentStatus=${status}&bookingId=${bookingId}&paidBy=${encodeURIComponent(paidBy)}&tranId=${tranId}`;

  return NextResponse.redirect(redirectUrl, 303);
}

export async function GET(req: Request) {
  return POST(req);
}