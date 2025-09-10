import { type IntegrationDTO } from "../types/DTOs";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { createServerClient } from "../lib/supabase/server";

export const getIntegrationsURL = async (request) => {
  try {
    const { supabase } = createServerClient(request);

    const { data: functionData, error } = await supabase.functions.invoke(
      "integration",
      {
        method: "GET",
      }
    );

    if (error) {
      console.error(error);
      return;
    }

    return functionData;
  } catch (error) {
    console.error(error);
  }
};

export const exchangeIntegrationCode = async (
  request,
  { token }: { token: string }
) => {
  try {
    const { supabase } = createServerClient(request);

    const { data, error } = await supabase.functions.invoke("callback", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    return { data, error };
  } catch (error) {
    console.error("Error exchanging integration code:", error);

    return { data: null, error };
  }
};

export const createIntegration = async ({
  name,
  userId,
  token,
}: {
  name: string;
  userId: string;
  token: string;
}) => {
  try {
    const client = createClient();

    const { data, error } = await client
      .from("integrations")
      .insert({ name, created_by: userId, tokens: token })
      .select("*")
      .single();

    const { data: boardData, error: boardError } = await client
      .from("boards")
      .insert({ integration: data.id, created_by: userId })
      .select("*")
      .single();

    if (error || boardError) {
      console.error("Error creating integration:", { error, boardError });
    }

    return data;
  } catch (error) {
    console.error("Error creating integration:", error);
  }
};

export const getUserIntegrations = async (
  request,
  userId: string
): Promise<{
  integrations: IntegrationDTO[];
  queryError: any;
}> => {
  try {
    const { supabase } = createServerClient(request);

    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("created_by", userId);

    if (error) {
      console.error("Error fetching integrations:", error);
    }

    return { integrations: data || [], error };
  } catch (error) {
    console.error("Error fetching integrations:", error);

    return { integrations: [], queryError: error as PostgrestError };
  }
};

export const removeUserIntegration = async (id: string) => {
  try {
    const client = createClient();

    const { data, error } = await client
      .from("integrations")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error removing integration:", error);
    }

    return data;
  } catch (error) {
    console.error("Error removing integration:", error);
  }
};

export const getTrelloBoards = async (token: string) => {
  try {
    const response = await fetch(
      `https://api.trello.com/1/members/me/boards?key=${process.env.TRELLO_API_KEY}&token=${token}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Trello boards");
    }

    const boards = await response.json();
    return boards;
  } catch (error) {
    console.error("Error fetching Trello boards:", error);
  }
};

export const updateIntegrationBoard = async (
  boardId: string,
  integrationId: string,
  name: string
) => {
  try {
    const client = createClient();

    const { data: board, error } = await client
      .from("boards")
      .update({ link_id: boardId, name })
      .eq("integration", integrationId)
      .select("*")
      .single();

    const { data: integration, error: integrationUpdateErr } = await client
      .from("integrations")
      .update({ board: boardId })
      .eq("id", integrationId)
      .select("*")
      .single();

    if (error || integrationUpdateErr) {
      console.error("Error updating integration:", error);
    }

    return { board, integration };
  } catch (error) {
    console.error("Error updating integration:", error);
  }
};
