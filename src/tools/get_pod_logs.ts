import { z } from "zod";
import { getCoreApi } from "../kube";

export const getPodLogsSchema = z.object({
  namespace: z.string().describe("Kubernetes namespace"),
  pod_name: z.string().describe("Pod name"),
  container: z.string().optional().describe("Container name (required for multi-container pods)"),
  tail_lines: z.number().optional().default(100).describe("Number of lines from the end to return"),
});

export type GetPodLogsInput = z.infer<typeof getPodLogsSchema>;

export async function getPodLogs(input: GetPodLogsInput): Promise<string> {
  const api = getCoreApi();

  const response = await api.readNamespacedPodLog(
    input.pod_name,
    input.namespace,
    input.container,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    input.tail_lines
  );

  return JSON.stringify(
    {
      pod: input.pod_name,
      namespace: input.namespace,
      container: input.container,
      logs: response.body,
    },
    null,
    2
  );
}
