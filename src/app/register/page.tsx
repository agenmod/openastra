import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { readSession } from "@/lib/auth";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await readSession();
  const { next } = await searchParams;
  const nextPath = next || "/create";
  if (session) redirect(nextPath);
  return <AuthForm mode="register" nextPath={nextPath} />;
}
