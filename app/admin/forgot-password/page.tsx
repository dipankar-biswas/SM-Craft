
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FormSet } from "./components/FormSet";

const LoginPage = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <FormSet />
    </>
  );
};
export default LoginPage;
