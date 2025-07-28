"use client";
import { FiSettings } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";

import { extractFragmentFromUrl } from "@/utils/extract-fragment";
import { createIntegration } from "./actions/integrations";
import { SuccessBanner } from "./components/SucessBanner";
import { IntegrationDTO } from "./data/DTOs";
import { JwtPayload } from "@supabase/supabase-js";
import { createSupbaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Integration from "./components/Integration";

type Props = {
  user: JwtPayload;
  integrations: IntegrationDTO[];
  redirectURL: any;
};

export default function Home({ user, integrations, redirectURL }: Props) {
  const [createdIntegration, setCreatedIntegration] =
    useState<IntegrationDTO | null>(null);
  const router = useRouter();

  const [allIntegrations, setAllIntegrations] =
    useState<IntegrationDTO[]>(integrations);

  useEffect(() => {
    const token = extractFragmentFromUrl(window.location.href, "token");

    if (token && allIntegrations?.length < 1) {
      addIntegration(token);
    }
  }, [allIntegrations]);

  const addIntegration = async (token: string) => {
    const integration = await createIntegration({
      token,
      name: "Trello",
      userId: user.sub,
    });

    router.replace("/");
    setCreatedIntegration(integration);
  };

  const supabase = createSupbaseClient();

  useEffect(() => {
    const realtimeChannel = supabase
      .channel("public:integrations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "integrations",
          // filter: `created_by=eq.${user.sub}`,
        },
        (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT" && payload.new) {
            setAllIntegrations((prev) => [
              ...prev,
              payload.new as IntegrationDTO,
            ]);
          }

          if (payload.eventType === "DELETE" && payload.old) {
            const filteredIntegrations = allIntegrations.filter(
              (item) => item.id !== payload.old.id
            );

            setAllIntegrations(filteredIntegrations);
          }
        }
      )
      .subscribe((status, error) => {
        console.log(`subscription state: ${status}`);

        if (error) {
          console.error("subscription state:", error);
        }
      });

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [supabase]);

  const trelloIntegration = useMemo(
    () => allIntegrations?.find((item) => item?.name === "Trello"),
    [allIntegrations]
  );

  return (
    <div className="shadow-lg bg-white rounded-lg w-[400px]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable
        theme="light"
      />

      <div className="border-b border-gray-300 flex justify-between px-6 items-center h-14">
        <div className="flex items-center gap-1.5">
          <FiSettings className="text-base text-gray-500" />
          <h1 className="font-sans text-base text-center">
            Manage Integrations
          </h1>
        </div>
      </div>

      {createdIntegration && <SuccessBanner type="Trello" />}

      <ul className="grid gap-6 px-6 my-4">
        <li>
          <Integration
            redirectURL={redirectURL?.url}
            integration={trelloIntegration}
            name="Trello"
            user={user}
          />
        </li>

        <li>
          <Integration name="Jira" user={user} disabled />
        </li>

        <li>
          <Integration name="Asana" user={user} disabled />
        </li>

        <li>
          <Integration name="Github Boards" user={user} disabled />
        </li>

        <li>
          <Integration name="Monday" user={user} disabled />
        </li>
      </ul>
    </div>
  );
}
