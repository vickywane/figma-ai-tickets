import { createSupbaseClient } from "@/utils/supabase/client";

export const getTaskBreakdown = async ({
  image,
}: {
  image: File;
}): Promise<{ data: any; error: any }> => {
  try {
    const supabase = createSupbaseClient();

    const arrayBuffer = await image.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    const { data, error } = await supabase.functions.invoke("generate-task", {
      method: "POST",
      body: JSON.stringify({
        image: `data:${image.type};base64,${base64String}`,
      }),
    });

    return { data, error };
  } catch (error) {
    console.error("Error invoking generate task function", error);

    return { data: null, error };
  }
};
