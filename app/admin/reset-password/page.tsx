
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { Suspense } from "react";

const LoginPage = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
    </>
  );
};
export default LoginPage;
