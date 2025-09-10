import { Link } from "react-router";

import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { AiOutlineLogout } from "react-icons/ai";

export default function Header({ user }: { user: any }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="border-b border-gray-300 flex justify-between px-6 items-center h-14">
      <Link to="/dashboard">
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
