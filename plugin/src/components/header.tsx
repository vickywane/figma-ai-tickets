import { RiLogoutCircleRLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

import useUserStore from "../stores/user";
import { createSupbaseClient } from "../clients/supabase";
import { LOGOUT_USER } from "../consts/messages";
import BoardIntegrations from "./BoardIntegrations";

// TODO: share types with the integration-web-store
const Header = ({ integrations }: { integrations: any[] }) => {
  const user = useUserStore((state) => state.user);
  const supabase = createSupbaseClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      parent.postMessage(
        {
          pluginMessage: {
            type: LOGOUT_USER,
          },
        },
        "*"
      );
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="w-full flex justify-between items-center px-4 h-12 bg-gray-800">
      <div className="flex gap-1 items-center">
        <FiUser className="text-white" />
        <p className="text-white text-xs text-center">{user?.email} </p>

        {integrations && <BoardIntegrations integrations={integrations} />}
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="text-white flex hover:bg-[#B91C1C] bg-[#FF3B30] items-center w-full rounded px-2 py-1"
        >
          <RiLogoutCircleRLine />
        </button>
      </div>
    </div>
  );
};

export default Header;
