import { NextResponse } from "next/server";
import { sendRegistrationEmail, verifyEmailConnection } from "@/lib/email";

export async function GET() {
  try {
    // Test email connection
    const isConnected = await verifyEmailConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { error: "Email service not configured properly" },
        { status: 500 }
      );
    }
    
    // Send test email
    const result = await sendRegistrationEmail(
      "dipankarbiswas.smvisabd@gmail.com", // Replace with your test email
      "Test User"
    );
    
    if (result.success) {
      return NextResponse.json({
        message: "Test email sent successfully",
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}