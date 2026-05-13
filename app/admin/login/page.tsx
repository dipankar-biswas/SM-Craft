
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./components/LoginForm";

const LoginPage = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <LoginForm />
    </>
  );
};
export default LoginPage;
