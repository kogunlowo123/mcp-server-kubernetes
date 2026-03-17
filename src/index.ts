import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { listPodsSchema, listPods } from "./tools/list_pods";
import { listDeploymentsSchema, listDeployments } from "./tools/list_deployments";
import { listServicesSchema, listServices } from "./tools/list_services";
import { getPodLogsSchema, getPodLogs } from "./tools/get_pod_logs";
import { applyManifestSchema, applyManifest } from "./tools/apply_manifest";
import { listNamespacesSchema, listNamespaces } from "./tools/list_namespaces";
import { getEventsSchema, getEvents } from "./tools/get_events";
import { scaleDeploymentSchema, scaleDeployment } from "./tools/scale_deployment";

const server = new McpServer({
  name: "mcp-server-kubernetes",
  version: "1.0.0",
});

server.tool(
  "list_pods",
  "List pods in a Kubernetes namespace with optional label selector filter",
  listPodsSchema.shape as any,
  async (input: any) => ({
    content: [{ type: "text" as const, text: await listPods(input) }],
  })
);

server.tool(
  "list_deployments",
  "List deployments in a Kubernetes namespace",
  listDeploymentsSchema.shape as any,
  async (input: any) => ({
    content: [{ type: "text" as const, text: await listDeployments(input) }],
  })
);

server.tool(
  "list_services",
  "List services in a Kubernetes namespace",
  listServicesSchema.shape as any,
  async (input: any) => ({
    content: [{ type: "text" as const, text: await listServices(input) }],
  })
);

server.tool(
  "get_pod_logs",
  "Get logs from a pod, optionally specifying container and tail line count",
  getPodLogsSchema.shape as any,
  async (input: any) => ({
    content: [{ type: "text" as const, text: await getPodLogs(input) }],
  })
);

server.tool(
  "apply_manifest",
  "Apply a Kubernetes manifest (YAML) to the cluster, creating or updating resources",
  applyManifestSchema.shape as any,
  async (input: any) => ({
    content: [{ type: "text" as const, text: await applyManifest(input) }],
  })
);

server.tool(
  "list_namespaces",
  "List all namespaces in the Kubernetes cluster",
  listNamespacesSchema.shape as any,
  async (input: any) => ({
    content: [{ type: "text" as const, text: await listNamespaces(input) }],
  })
);

server.tool(
  "get_events",
  "Get Kubernetes events, optionally filtered by namespace",
  getEventsSchema.shape as any,
  async (input: any) => ({
    content: [{ type: "text" as const, text: await getEvents(input) }],
  })
);

server.tool(
  "scale_deployment",
  "Scale a Kubernetes deployment to a specified number of replicas",
  scaleDeploymentSchema.shape as any,
  async (input: any) => ({
    content: [{ type: "text" as const, text: await scaleDeployment(input) }],
  })
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mcp-server-kubernetes running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
