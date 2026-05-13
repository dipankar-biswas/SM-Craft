
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RegistrationForm } from "./components/RegistrationForm";

const LoginPage = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <RegistrationForm />
    </>
  );
};
export default LoginPage;
