import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendRegistrationEmail, verifyEmailConnection } from "@/lib/email";
import { User } from "@/model/user-model";
import { dbConnect } from "@/service/mongo";

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
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log("User created successfully:", user._id);
    
    // Send welcome email (don't await - let it run in background)
    sendRegistrationEmail(user.email, user.name)
      .then(result => {
        if (result.success) {
          console.log("Welcome email sent to:", user.email);
        } else {
          console.error("Failed to send welcome email:", result.error);
        }
      })
      .catch(error => {
        console.error("Email sending error:", error);
      });
    
    // Return success response
    return NextResponse.json(
      {
        message: "User registered successfully. Welcome email sent!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Registration error details:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}