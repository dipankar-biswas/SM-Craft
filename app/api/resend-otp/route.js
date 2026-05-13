import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";
import User from "@/model/user-model";
import { dbConnect } from "@/service/mongo";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.verificationCode = otp;
    user.verificationCodeExpires = otpExpires;
    await user.save();
    
    // Send new verification email
    await sendVerificationEmail(user.email, otp, user.name);
    
    return NextResponse.json({
      message: "New verification code sent to your email",
      email: user.email
    });
    
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}