import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/model/user-model";
import { sendVerificationEmail } from "@/lib/email";
import { dbConnect } from "@/service/mongo";

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    console.log("1. Register API called");
    
    const body = await request.json();
    const { name, email, password } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (!existingUser.isVerified) {
        // User exists but not verified, resend OTP
        const otp = generateOTP();
        existingUser.verificationCode = otp;
        existingUser.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await existingUser.save();
        
        // Send verification email
        await sendVerificationEmail(existingUser.email, otp, existingUser.name);
        
        return NextResponse.json({
          message: "Verification code resent to your email",
          email: existingUser.email,
          requiresVerification: true
        }, { status: 200 });
      }
      
      return NextResponse.json(
        { error: "User with this email already exists and is verified" },
        { status: 409 }
      );
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user (unverified)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
      isActive: true,
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpires: otpExpires,
    });
    
    console.log("User created successfully:", user._id);
    
    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, otp, user.name);
    
    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
    }
    
    // Return response
    return NextResponse.json({
      message: "Registration successful! Please verify your email with the OTP sent.",
      email: user.email,
      requiresVerification: true
    }, { status: 201 });
    
  } catch (error) {
    console.error("Registration error details:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}