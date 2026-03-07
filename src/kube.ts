import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();

try {
  kc.loadFromDefault();
} catch {
  kc.loadFromCluster();
}

export function getCoreApi(): k8s.CoreV1Api {
  return kc.makeApiClient(k8s.CoreV1Api);
}

export function getAppsApi(): k8s.AppsV1Api {
  return kc.makeApiClient(k8s.AppsV1Api);
}

export function getObjectApi(): k8s.KubernetesObjectApi {
  return k8s.KubernetesObjectApi.makeApiClient(kc);
}

export { kc };
