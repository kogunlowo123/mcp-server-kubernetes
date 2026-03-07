import { z } from "zod";
import * as k8s from "@kubernetes/client-node";
import { kc } from "../kube";
import * as yaml from "yaml";

export const applyManifestSchema = z.object({
  manifest: z.string().describe("Kubernetes manifest as YAML string"),
});

export type ApplyManifestInput = z.infer<typeof applyManifestSchema>;

export async function applyManifest(input: ApplyManifestInput): Promise<string> {
  const client = k8s.KubernetesObjectApi.makeApiClient(kc);

  const specs = yaml.parseAllDocuments(input.manifest).map((doc) => doc.toJSON());

  const results: Array<Record<string, unknown>> = [];

  for (const spec of specs) {
    if (!spec || !spec.kind) continue;

    spec.metadata = spec.metadata || {};
    spec.metadata.annotations = spec.metadata.annotations || {};
    spec.metadata.annotations["kubectl.kubernetes.io/last-applied-configuration"] =
      JSON.stringify(spec);

    try {
      await client.read(spec as k8s.KubernetesObject);
      const response = await client.patch(spec as k8s.KubernetesObject);
      results.push({
        action: "patched",
        kind: spec.kind,
        name: spec.metadata.name,
        namespace: spec.metadata.namespace,
      });
    } catch {
      const response = await client.create(spec as k8s.KubernetesObject);
      results.push({
        action: "created",
        kind: spec.kind,
        name: spec.metadata.name,
        namespace: spec.metadata.namespace,
      });
    }
  }

  return JSON.stringify(results, null, 2);
}
