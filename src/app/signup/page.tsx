import Signup from "@/components/auth/Signup";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const user = await getAuthSession();

  if (user) {
    redirect("/");
  }

  return <Signup />;
}
