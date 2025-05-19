"use client";

import { useRouter } from "next/navigation"; // Note: navigation, not router

export default function ClientSideComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/some-route");
  };

  return <button onClick={handleClick}>Navigate</button>;
}
