"use server";

import { IntegrationDTO } from "../data/DTOs";
import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const getIntegrationsURL = async () => {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: functionData, error } = await supabase.functions.invoke(
      "integration",
      {
        method: "GET",
      }
    ); 

    if (error) {
      console.error("Error invoking integration redirect function:", error);
      return;
    }
    
    return functionData;
  } catch (error) {
    console.error("Error fetching redirect URL:", error);
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
    const client = await createSupabaseServerClient();

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

    console.log(boardData);

    if (error || boardError) {
      console.error("Error creating integration:", { error, boardError });
    }

    return data;
  } catch (error) {
    console.error("Error creating integration:", error);
  }
};

export const getUserIntegrations = async (
  userId: string
): Promise<{
  integrations: IntegrationDTO[];
  queryError: PostgrestError | null;
}> => {
  try {
    const client = await createSupabaseServerClient();

    const queryData = await client
      .from("integrations")
      .select("*")
      .eq("created_by", userId);

    const { data, error: queryError } = queryData;

    if (queryError) {
      console.error("Error fetching user integrations:", queryError);
    }

    return { integrations: data || [], queryError };
  } catch (error) {
    console.error("Error fetching user integrations:", error);

    return { integrations: [], queryError: error as PostgrestError };
  }
};

export const removeUserIntegration = async (id: string) => {
  try {
    const client = await createSupabaseServerClient();

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
    const client = await createSupabaseServerClient();

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
