import { FaTrello } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";

import { createSupbaseClient } from "../clients/supabase";
import { INTEGRATION_STORE_URL } from "../../env";

// TODO: share types with the integration-web-store
const BoardIntegrations = ({ integrations }: { integrations: any[] }) => {
  const supabase = createSupbaseClient();

  const handleIntegrationLaunch = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return console.error("No session available to launch integration.");
      }

      const url = `${INTEGRATION_STORE_URL}?access_token=${session.access_token}&refresh_token=${session.refresh_token}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error launching integration store:", error);
    }
  };

  return (
    <div
      onClick={handleIntegrationLaunch}
      className="border ml-1 py-1 hover:cursor-pointer px-1.5  border-dashed  border-gray-300 hover:border-white"
    >
      <ul>
        {integrations.length === 0 ? (
          <li className="flex items-center gap-1 text-xs text-gray-300 hover:text-white">
            <FiPlus className="text-xs" />
            <p className="text-xs ">Add Integration </p>
          </li>
        ) : (
          integrations?.map((integration) => (
            <li
              key={integration.id}
              className="flex items-center gap-1 text-xs text-gray-300 hover:text-white"
            >
              <FaTrello className="text-xs" />
              {integration.name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BoardIntegrations;
