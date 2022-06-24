# Learning Kubernetes

This repository is snapshot of my working directory for hands-on related to K8s concepts.

Directory `container` contains the code to build the sample images used throughout my learning. The images are also available on the Dockerhub if needed.

[Dockerhub link](https://hub.docker.com/u/darshah)

## My Setup

1. Windows 10 Home Edition + WSL2
    - Docker Desktop
    - Kind for K8s
2. MacOS
    - Colima

IDE:
  - VSCode
    - oderwat.indent-rainbow
    - ms-kubernetes-tools.vscode-kubernetes-tools

## Notes

```
kubectl api-resources
```

### Port Forwarding

```
kubectl port-forward deployment/hello-world-deployment 4224:80
```

### Deployment Strategies

```
deployment.spec.strategy.type: (Recreate|RollingUpdate)
```

1. Recreate - stops all running pods and then creates newer ones
2. RollingUpdate (default) - stopping and starting of pods is done in parallel to avoid downtime.

*Exercise*
```
- kubectl delete -f k8s/deployment.yaml
- Update k8s/deployment.yaml to point to version v1
- kubectl apply -f k8s/deployment.yaml
- kubectl rollout history deployment.apps/hello-world-deployment
- kubectl port-forward deployment.apps/hello-world-deployment 4224:80
- curl http://localhost:4224/
- Update k8s/deployment.yaml to point to version v2
- kubectl apply -f k8s/deployment.yaml
- kubectl rollout history deployment.apps/hello-world-deployment
- kubectl port-forward deployment.apps/hello-world-deployment 4224:80
- curl http://localhost:4224/
```

### Services

Types:
  - ClusterIP (default)
  - NodePort
  - ExternalName
  - LoadBalancer

```
kubectl describe svc inventory-service
> Endpoints:         10.244.0.10:80,10.244.0.11:80

kubectl get endpoints
> NAME                ENDPOINTS                       AGE
> inventory-service   10.244.0.10:80,10.244.0.11:80   3m11s
```