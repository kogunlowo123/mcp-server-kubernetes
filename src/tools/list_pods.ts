import { z } from "zod";
import { getCoreApi } from "../kube";

export const listPodsSchema = z.object({
  namespace: z.string().optional().default("default").describe("Kubernetes namespace"),
  label_selector: z.string().optional().describe("Label selector (e.g., app=nginx)"),
});

export type ListPodsInput = z.infer<typeof listPodsSchema>;

export async function listPods(input: ListPodsInput): Promise<string> {
  const api = getCoreApi();

  const response = await api.listNamespacedPod(
    input.namespace,
    undefined,
    undefined,
    undefined,
    undefined,
    input.label_selector
  );

  const pods = response.body.items.map((pod) => ({
    name: pod.metadata?.name,
    namespace: pod.metadata?.namespace,
    status: pod.status?.phase,
    podIP: pod.status?.podIP,
    nodeName: pod.spec?.nodeName,
    containers: pod.spec?.containers.map((c) => c.name),
    startTime: pod.status?.startTime?.toISOString(),
    restartCount: pod.status?.containerStatuses?.reduce((sum, cs) => sum + cs.restartCount, 0),
  }));

  return JSON.stringify(pods, null, 2);
}
