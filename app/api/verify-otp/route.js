import { NextResponse } from "next/server";
import User from "@/model/user-model";
import { dbConnect } from "@/service/mongo";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body;
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Find user with valid OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: otp,
      verificationCodeExpires: { $gt: new Date() }, // Not expired
    }).select('+verificationCode +verificationCodeExpires');
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }
    
    // Update user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    
    console.log("User verified successfully:", user.email);
    
    return NextResponse.json({
      message: "Email verified successfully! You can now login.",
      verified: true
    });
    
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}