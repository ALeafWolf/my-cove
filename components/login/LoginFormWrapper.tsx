"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import LoginForm from "@/components/login/LoginForm";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";

export default function LoginFormWrapper() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (data: FieldValues) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    }
  };

  return <LoginForm loginFunction={handleLogin} loginError={error} />;
}
