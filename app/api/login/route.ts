import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/model/user-model";
import { signIn } from "@/auth";

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json() as { email: string; password: string };
  await dbConnect();

  try {
    const response = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    return new NextResponse("User logged in!", {
      status: 200,
    });
  } catch (e) {
    // console.log(e);
    const error = e as Error;
    return new NextResponse(error.message, {
      status: 201,
    });
  }
};