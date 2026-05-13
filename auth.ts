
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./model/user-model";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        
        if (credentials == null) return null;

        try {
          const user = await User.findOne({ email: credentials.email });
          // console.log(user);
          if (!user) {
            throw new Error("User not found");
          }

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password,
            );
            if (isMatch) {
              // console.log("Password Matched");
              // Update last login
              user.lastLogin = new Date();
              await user.save();
              
              // Return user object
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin,
              };
            } else {
              // console.error("Password Mismatch");
              throw new Error("Invalid password");
            }
          } else {
            // console.error("User not found!");
            throw new Error("User not found!");
          }
        } catch (err) {
          // console.error(err)
          throw new Error(err);
        }
      },
    }),
  ],
  trustHost: true,
});
