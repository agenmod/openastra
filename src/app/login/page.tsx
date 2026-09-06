import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { readSession } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await readSession();
  const { next } = await searchParams;
  const nextPath = next || "/";
  if (session) redirect(nextPath);
  return <AuthForm mode="login" nextPath={nextPath} />;
}
