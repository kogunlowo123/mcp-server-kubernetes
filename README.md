# mcp-server-kubernetes

An MCP (Model Context Protocol) server that provides tools for interacting with Kubernetes clusters, including pods, deployments, services, namespaces, events, and manifest management.

## Architecture

```mermaid
graph TB
    subgraph Client
        style Client fill:#4A90D9,stroke:#2E6BA6,color:#FFFFFF
        MCP_Client["MCP Client"]
    end

    subgraph Server["mcp-server-kubernetes"]
        style Server fill:#2ECC71,stroke:#1A9B52,color:#FFFFFF
        Index["index.ts<br/>MCP Server Entry"]
        subgraph Tools
            style Tools fill:#F39C12,stroke:#C67D0A,color:#FFFFFF
            T1["list_pods"]
            T2["list_deployments"]
            T3["list_services"]
            T4["get_pod_logs"]
            T5["apply_manifest"]
            T6["list_namespaces"]
            T7["get_events"]
            T8["scale_deployment"]
        end
    end

    subgraph K8s["Kubernetes Cluster"]
        style K8s fill:#326CE5,stroke:#1E4FA0,color:#FFFFFF
        API["API Server"]
        subgraph Resources
            style Resources fill:#E74C3C,stroke:#B83A2E,color:#FFFFFF
            Pods["Pods"]
            Deploys["Deployments"]
            Svcs["Services"]
            NS["Namespaces"]
            Events["Events"]
        end
    end

    MCP_Client -- "stdio transport" --> Index
    Index --> T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8
    T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 --> API
    API --> Pods & Deploys & Svcs & NS & Events
```

## Installation

```bash
npm install
npm run build
```

## Configuration

The server uses the default kubeconfig file (`~/.kube/config`) or in-cluster configuration when running inside Kubernetes.

| Variable | Description | Required |
|---|---|---|
| `KUBECONFIG` | Path to kubeconfig file | No (defaults to `~/.kube/config`) |

## Usage

### Standalone

```bash
npm start
```

### Development

```bash
npm run dev
```

### Docker

```bash
docker build -t mcp-server-kubernetes .
docker run -v ~/.kube/config:/root/.kube/config:ro mcp-server-kubernetes
```

### MCP Client Configuration

```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "KUBECONFIG": "/path/to/kubeconfig"
      }
    }
  }
}
```

## Tool Reference

| Tool | Description | Parameters |
|---|---|---|
| `list_pods` | List pods | `namespace?`, `label_selector?` |
| `list_deployments` | List deployments | `namespace?` |
| `list_services` | List services | `namespace?` |
| `get_pod_logs` | Get pod logs | `namespace`, `pod_name`, `container?`, `tail_lines?` |
| `apply_manifest` | Apply a K8s manifest | `manifest` (YAML string) |
| `list_namespaces` | List namespaces | none |
| `get_events` | Get cluster events | `namespace?` |
| `scale_deployment` | Scale a deployment | `namespace`, `deployment_name`, `replicas` |

## License

MIT
