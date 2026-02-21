import { Metadata } from "next";
import GeneralHeader from "../components/general/HeaderSection";
import AuthStatus from "../components/general/AuthStatus";

export const metadata: Metadata = {
  title: "My Cove",
  description: "Welcome to My Cove",
};

export default function HomePage() {
  return (
    <>
      <GeneralHeader />
      <div className="content-container mx-auto px-4 py-8">
        <AuthStatus />
      </div>
    </>
  );
}
