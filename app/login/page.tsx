import { Metadata } from "next";
import LoginFormWrapper from "@/components/login/LoginFormWrapper";

export const metadata: Metadata = {
  title: "登录 - The ZZZ Cove",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoginFormWrapper />
    </div>
  );
}
