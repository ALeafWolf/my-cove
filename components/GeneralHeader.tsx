import Link from "next/link";

const GeneralHeader = () => {
  return (
    <div className="flex justify-center items-center flex-col mb-4 p-4">
      <Link href="/">
        <h1>My Cove</h1>
      </Link>
      <p>屯放各种脑洞之地</p>
    </div>
  );
};

export default GeneralHeader;
