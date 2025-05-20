import { Metadata } from "next";
import GeneralHeader from "../components/home/HeaderSection";
import AuthStatus from "../components/home/AuthStatus";

export const metadata: Metadata = {
  title: "My Cove",
  description: "Welcome to My Cove",
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <GeneralHeader />
      <AuthStatus />
    </div>
  );
}
