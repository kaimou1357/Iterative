"use client";
import Login from "../components/Login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStytchUser } from "@stytch/nextjs";

export default function LoginPage() {
  const { user, isInitialized } = useStytchUser();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (user) {
      router.replace("/tool");
    }
  }, [user, isInitialized, router]);
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Login />
    </main>
  );
}
