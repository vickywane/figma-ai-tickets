import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { openai } from "npm:@ai-sdk/openai";
import { generateObject } from "npm:ai";
import { z } from "npm:zod@3.25.76";

import { GENERATE_TASK_INSTRUCTION } from "../consts.ts";

const requestSchema = z.object({
  message: z.string().describe("content for task generated"),
  title: z.string().describe("title of the ticket generated"),
});

export const extractDetails = async (image: string) => {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: requestSchema,
      messages: [
        {
          role: "user", // TODO: move into being system info for the AI agent
          content: [
            {
              type: "text",
              text: GENERATE_TASK_INSTRUCTION,
            },
            {
              type: "image",
              image,
            },
          ],
        },
      ],
    });

    return object;
  } catch (error) {
    return error;
  }
};
