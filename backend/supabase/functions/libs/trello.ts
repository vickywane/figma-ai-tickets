const TRELLO_API_KEY = Deno.env.get("TRELLO_API_KEY");
const TRELLO_API_TOKEN = Deno.env.get("TRELLO_API_TOKEN");
const TRELLO_API_ENDPOINT = Deno.env.get("TRELLO_API_ENDPOINT");

if (!TRELLO_API_KEY || !TRELLO_API_TOKEN) {
  throw new Error(`err: trello env vars missing`);
}

type Task = {
  listId: string;
  title: string;
  content: string;
  token: string;
};

export const createTask = async ({ listId, title, content, token }: Task) => {
  try {
    const params = new URLSearchParams({
      idList: listId,
      key: TRELLO_API_KEY,
      token,
      name: title,
      desc: content,
    });

    const response = await fetch(
      `${TRELLO_API_ENDPOINT}/cards?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`error: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (e) {
    return e;
  }
};
 
export const generateAuthURL = ({
  redirectUrl,
  state,
}: {
  redirectUrl: string;
  state?: any;
}) => {
  const params = new URLSearchParams({
    response_type: "code",
    key: TRELLO_API_KEY,
    scope: "read,write",
    return_url: redirectUrl,
    callback_method: "fragment",
    expiration: "never",
  });

  if (state) {
    params.append("state", JSON.stringify(state));
  }

  return `${TRELLO_API_ENDPOINT}/authorize?${params.toString()}`;
};

export const retrieveTaskBoards = async (
  boardId: string,
  authToken: string
) => {
  const endpoint = `${TRELLO_API_ENDPOINT}/boards/${boardId}/lists?key=${TRELLO_API_KEY}&token=${authToken}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`error: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (e) {
    return e;
  }
};
