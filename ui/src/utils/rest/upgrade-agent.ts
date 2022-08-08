import { UpgradeAgentResponse } from "../../types/rest";

export async function upgradeAgent(
  id: string,
  version: string
): Promise<string[]> {
  const endpoint = `/v1/agents/${id}/version`;
  const body = { version };

  const resp = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

  switch (resp.status) {
    case 204:
      return [];
    case 200:
      const { errors } = (await resp.json()) as UpgradeAgentResponse;
      return errors;
    default:
      throw new Error("failed to post upgrade");
  }
}

export async function upgradeAgents(ids: string[], version?: string) {
  const endpoint = "v1/agents/version";
  const body = { ids, version };

  const resp = await fetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  switch (resp.status) {
    case 204:
      return [];
    default:
      const { errors } = (await resp.json()) as UpgradeAgentResponse;
      return errors;
  }
}
