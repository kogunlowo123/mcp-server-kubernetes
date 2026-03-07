import { z } from "zod";
import { getAppsApi } from "../kube";

export const scaleDeploymentSchema = z.object({
  namespace: z.string().describe("Kubernetes namespace"),
  deployment_name: z.string().describe("Deployment name"),
  replicas: z.number().int().min(0).describe("Desired number of replicas"),
});

export type ScaleDeploymentInput = z.infer<typeof scaleDeploymentSchema>;

export async function scaleDeployment(input: ScaleDeploymentInput): Promise<string> {
  const api = getAppsApi();

  const response = await api.patchNamespacedDeployment(
    input.deployment_name,
    input.namespace,
    {
      spec: {
        replicas: input.replicas,
      },
    },
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    {
      headers: { "Content-Type": "application/strategic-merge-patch+json" },
    }
  );

  return JSON.stringify(
    {
      name: response.body.metadata?.name,
      namespace: response.body.metadata?.namespace,
      replicas: response.body.spec?.replicas,
      readyReplicas: response.body.status?.readyReplicas ?? 0,
      updatedReplicas: response.body.status?.updatedReplicas ?? 0,
    },
    null,
    2
  );
}
