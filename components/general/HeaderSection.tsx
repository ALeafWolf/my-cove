"use client";

import Link from "next/link";
import NavLinks from "./NavLinks";

const GeneralHeader = () => {
  return (
    <header className="flex justify-center items-center flex-col mb-4 py-4 gap-2">
      <Link href="/">
        <h1>眠洞</h1>
      </Link>
      <p>屯放各种脑洞之地</p>
      <NavLinks />
    </header>
  );
};

export default GeneralHeader;
