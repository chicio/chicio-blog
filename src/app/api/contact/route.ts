import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { ContactNotificationEmail } from "@/components/sections/contact/components/contact-email-notification";
import { ContactConfirmationEmail } from "@/components/sections/contact/components/contact-email-confirmation";
import { checkRateLimitFor, incrementRateLimit } from "@/lib/rate-limit/rate-limit";
import { getClientIp } from "@/lib/network/network";

const resend = new Resend(process.env.RESEND_API_KEY);

const successResponse = {
  body: { success: true },
  init: { status: 200 },
};

const validation = (name: string, email: string, message: string): { body: { error: string}, init: ResponseInit } | undefined => {
  if (!name || !email || !message) {
    return {
      body: { error: "All fields are required" },
      init: { status: 400 },
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      body: { error: "Invalid email address" },
      init: { status: 400 },
    };
  }

  if (message.length < 10) {
    return {
      body: { error: "Message must be at least 10 characters long" },
      init: { status: 400 },
    };
  }
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, honeypot } = await request.json();
    
    if (honeypot) {
      return NextResponse.json(successResponse.body, successResponse.init);
    }
    
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = await checkRateLimitFor(clientIp);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 },
      );
    }
    
    const validationError = validation(name, email, message);
    
    if (validationError) {
      return NextResponse.json(validationError.body, validationError.init);
    }

    const { error: notificationError } = await resend.emails.send({
      from: "fabrizioduroni.it Contact Form <contact@fabrizioduroni.it>",
      to: ["fabrizio.duroni@gmail.com"],
      replyTo: email,
      subject: `Chicio Coding - Contact from ${name}`,
      react: ContactNotificationEmail({ name, email, message }),
    });

    if (notificationError) {
      console.error("Notification email error:", notificationError);
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 },
      );
    }

    const { error: confirmationError } = await resend.emails.send({
      from: "Fabrizio Duroni <contact@fabrizioduroni.it>",
      to: [email],
      subject: `Chicio Coding - Wake up, ${name}... The Matrix has you.`,
      react: ContactConfirmationEmail({ name, message }),
    });

    if (confirmationError) {
      console.error("Confirmation email error:", confirmationError);
      console.warn("Notification sent but confirmation failed");
    }

    await incrementRateLimit(clientIp);

    return NextResponse.json(successResponse.body, successResponse.init);
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
