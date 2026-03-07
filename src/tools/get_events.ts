import { z } from "zod";
import { getCoreApi } from "../kube";

export const getEventsSchema = z.object({
  namespace: z.string().optional().describe("Kubernetes namespace. If omitted, returns events from all namespaces."),
});

export type GetEventsInput = z.infer<typeof getEventsSchema>;

export async function getEvents(input: GetEventsInput): Promise<string> {
  const api = getCoreApi();

  let response;
  if (input.namespace) {
    response = await api.listNamespacedEvent(input.namespace);
  } else {
    response = await api.listEventForAllNamespaces();
  }

  const events = response.body.items.map((event) => ({
    namespace: event.metadata?.namespace,
    name: event.metadata?.name,
    type: event.type,
    reason: event.reason,
    message: event.message,
    involvedObject: {
      kind: event.involvedObject?.kind,
      name: event.involvedObject?.name,
      namespace: event.involvedObject?.namespace,
    },
    count: event.count,
    firstTimestamp: event.firstTimestamp?.toISOString(),
    lastTimestamp: event.lastTimestamp?.toISOString(),
    source: event.source?.component,
  }));

  return JSON.stringify(events, null, 2);
}
