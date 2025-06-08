"use client";

import Link from "next/link";
import NavLinks from "./NavLinks";
import { useSession } from "next-auth/react";

const GeneralHeader = () => {
  const { data: session } = useSession();
  return (
    <div className="flex justify-center items-center flex-col mb-4 p-4 gap-2">
      <Link href="/">
        <h1>My Cove</h1>
      </Link>
      <p>屯放各种脑洞之地</p>
      {session?.user && <NavLinks />}
    </div>
  );
};

export default GeneralHeader;
