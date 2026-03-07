import { z } from "zod";
import { getAppsApi } from "../kube";

export const listDeploymentsSchema = z.object({
  namespace: z.string().optional().default("default").describe("Kubernetes namespace"),
});

export type ListDeploymentsInput = z.infer<typeof listDeploymentsSchema>;

export async function listDeployments(input: ListDeploymentsInput): Promise<string> {
  const api = getAppsApi();

  const response = await api.listNamespacedDeployment(input.namespace);

  const deployments = response.body.items.map((dep) => ({
    name: dep.metadata?.name,
    namespace: dep.metadata?.namespace,
    replicas: dep.spec?.replicas,
    readyReplicas: dep.status?.readyReplicas ?? 0,
    availableReplicas: dep.status?.availableReplicas ?? 0,
    updatedReplicas: dep.status?.updatedReplicas ?? 0,
    strategy: dep.spec?.strategy?.type,
    creationTimestamp: dep.metadata?.creationTimestamp?.toISOString(),
  }));

  return JSON.stringify(deployments, null, 2);
}
