const LINEAR_API_ENDPOINT = Deno.env.get("LINEAR_API_ENDPOINT");
const LINEAR_APP_URL = Deno.env.get("LINEAR_APP_URL");
const LINEAR_CLIENT_ID = Deno.env.get("LINEAR_CLIENT_ID");
const LINEAR_CLIENT_SECRET = Deno.env.get("LINEAR_CLIENT_SECRET");

if (
  !LINEAR_CLIENT_SECRET ||
  !LINEAR_CLIENT_ID ||
  !LINEAR_API_ENDPOINT ||
  !LINEAR_APP_URL
) {
  throw new Error("LINEAR integration env vars missing");
}

export const generateLinearAuthURL = ({
  redirectUrl,
  state,
}: {
  redirectUrl: string;
  state?: any;
}) => {
  const linearParams = new URLSearchParams({
    redirect_uri: redirectUrl,
    client_id: LINEAR_CLIENT_ID,
    scope: "read,issues:create",
    actor: "app",
    prompt: "consent",
    response_type: "code",
  });

  if (state) {
    linearParams.append("state", JSON.stringify(state));
  }

  return `${LINEAR_APP_URL}/authorize?${linearParams.toString()}`;
};

export const exchangeCode = async ({
  code,
  redirectUri,
}: {
  code: string;
  redirectUri: string;
}) => {
  const params = new URLSearchParams({
    client_id: LINEAR_CLIENT_ID,
    client_secret: LINEAR_CLIENT_SECRET,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(`${LINEAR_API_ENDPOINT}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    console.error("err:", await response.text());

    throw new Error("Failed to exchange code");
  }

  return response.json();
};

export const createIssue = async ({
  accessToken,
  title,
  description,
  teamId,
  assigneeId,
  priority,
  labelIds,
}: {
  accessToken: string;
  title: string;
  description?: string;
  teamId: string;
  assigneeId?: string;
  priority?: number;
  labelIds?: string[];
}) => {
  const mutation = `
    mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          title
          description
          url
          identifier
          state {
            name
          }
          team {
            name
          }
          assignee {
            name
            email
          }
        }
        lastSyncId
      }
    }
  `;

  const variables = {
    input: {
      title,
      description,
      teamId,
      ...(assigneeId && { assigneeId }),
      ...(priority && { priority }),
      ...(labelIds && labelIds.length > 0 && { labelIds }),
    },
  };

  const response = await fetch(LINEAR_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });

  if (!response.ok) {
    console.error("Linear API error:", await response.text());
    throw new Error("Failed to create issue");
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("GraphQL mutation failed");
  }

  return result.data.issueCreate;
};
