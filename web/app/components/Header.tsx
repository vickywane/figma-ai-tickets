"use client";
import Link from "next/link";
import { AiOutlineLogout } from "react-icons/ai";
import { createSupbaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { JwtPayload } from "@supabase/supabase-js";

export default function Header({ user }: { user: JwtPayload }) {
  const supabase = createSupbaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="border-b border-gray-300 flex justify-between px-6 items-center h-14">
      <Link href="/">
        <h1 className="font-sans font-semibold text-base text-center">
          AI Tickets Integration
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <div>
          <p className="font-sans">Hey, {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-white flex items-center gap-2 hover:cursor-pointer hover:bg-[#B91C1C] bg-[#FF3B30]  rounded px-2 py-1"
        >
          <AiOutlineLogout />
          Logout
        </button>
      </div>
    </div>
  );
}
