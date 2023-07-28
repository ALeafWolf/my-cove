import LoginForm from "@/components/LoginForm";
import { useState } from "react";
import Head from "next/head";
import { FieldValues } from "react-hook-form";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const handleLogin = async (data: FieldValues) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (result?.ok) {
      router.replace('/');
      return;
    }
    alert('Credential is not valid');
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
