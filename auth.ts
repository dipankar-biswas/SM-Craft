import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./model/user-model";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          // কানেকশন string to boolean প্রপারলি
          const isVerifyEmailFlow = credentials?.verifyEmail === "true" || 
                                     credentials?.verifyEmail === true;
          
          // ইমেইল ভেরিফিকেশন ফ্লোতে পাসওয়ার্ড চেক করা লাগবে না
          if (!isVerifyEmailFlow) {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Email and password are required");
            }
          }

          // ইমেইল ভেরিফিকেশন ফ্লোতেও email প্রয়োজন
          if (!credentials?.email) {
            throw new Error("Email is required");
          }

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found");
          }

          // CRITICAL: Check if email is verified
          if (!user.isVerified && !isVerifyEmailFlow) {
            throw new Error(
              "Please verify your email before logging in. Check your inbox for verification link.",
            );
          }

          if (!user.isActive) {
            throw new Error("Account is deactivated");
          }

          // শুধুমাত্র নরমাল লগইনে পাসওয়ার্ড চেক করবেন
          if (!isVerifyEmailFlow) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password,
            );

            if (!isMatch) {
              throw new Error("Invalid password");
            }
          }

          // Update last login (ভেরিফিকেশন ফ্লোতে ও আপডেট করতে পারেন)
          user.lastLogin = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Error page
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET, // Add this
});