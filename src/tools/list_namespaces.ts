import { z } from "zod";
import { getCoreApi } from "../kube";

export const listNamespacesSchema = z.object({});

export type ListNamespacesInput = z.infer<typeof listNamespacesSchema>;

export async function listNamespaces(_input: ListNamespacesInput): Promise<string> {
  const api = getCoreApi();

  const response = await api.listNamespace();

  const namespaces = response.body.items.map((ns) => ({
    name: ns.metadata?.name,
    status: ns.status?.phase,
    creationTimestamp: ns.metadata?.creationTimestamp?.toISOString(),
    labels: ns.metadata?.labels,
  }));

  return JSON.stringify(namespaces, null, 2);
}
