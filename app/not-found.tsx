import Link from "next/link";
import GeneralHeader from "@/components/general/HeaderSection";

export default function NotFound() {
  return (
    <div>
      <GeneralHeader />
      <div className="content-container mx-auto flex flex-col items-center gap-4 py-16">
        <h2 className="text-4xl font-bold">404</h2>
        <p className="text-gray-400">页面不存在或无权访问</p>
        <Link
          href="/"
          className="px-4 py-2 border hover:underline focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
