import { z } from "zod";
import { getCoreApi } from "../kube";

export const listServicesSchema = z.object({
  namespace: z.string().optional().default("default").describe("Kubernetes namespace"),
});

export type ListServicesInput = z.infer<typeof listServicesSchema>;

export async function listServices(input: ListServicesInput): Promise<string> {
  const api = getCoreApi();

  const response = await api.listNamespacedService(input.namespace);

  const services = response.body.items.map((svc) => ({
    name: svc.metadata?.name,
    namespace: svc.metadata?.namespace,
    type: svc.spec?.type,
    clusterIP: svc.spec?.clusterIP,
    externalIP: svc.status?.loadBalancer?.ingress?.map((i) => i.ip || i.hostname),
    ports: svc.spec?.ports?.map((p) => ({
      name: p.name,
      port: p.port,
      targetPort: p.targetPort,
      protocol: p.protocol,
    })),
    selector: svc.spec?.selector,
  }));

  return JSON.stringify(services, null, 2);
}
