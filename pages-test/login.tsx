import LoginForm from "@/components/login/LoginForm";
import { useState } from "react";
import Head from "next/head";
import { FieldValues } from "react-hook-form";
import { signIn } from "@/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const handleLogin = async (data: FieldValues) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!result?.error) {
        // Successfully signed in
        router.replace("/");
        return;
      }
      // Show error message if login failed
      alert("Credential is not valid");
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Head>
        <title>登录 | My Cove</title>
      </Head>
      <LoginForm loginFunction={handleLogin} />
    </div>
  );
}
