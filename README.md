# Learning Kubernetes

This repository is snapshot of my working directory for hands-on related to K8s concepts.

Directory `container` contains the code to build the sample images used throughout my learning. The images are also available on the Dockerhub if needed.

[Dockerhub link](https://hub.docker.com/u/darshah)

## My Setup

1. Windows 10 Home Edition + WSL2
    - Docker Desktop
    - ~~Kind for K8s~~
    - Minikube in WSL2
2. MacOS
    - Colima

IDE:
  - VSCode
    - oderwat.indent-rainbow
    - ms-kubernetes-tools.vscode-kubernetes-tools

# Notes


```sh
kubectl api-resources
kubectl port-forward deployment/hello-world-deployment 4224:80
kubectl get all -n metallb-system # for specific namespace
kubectl get all --all-namespaces # for all namespaces
kubectl explain service.spec.type # 😲
```

## Helpful Alias
```sh
alias kpo='kubectl get po -o wide'
alias kpow='kubectl get po -w'
alias ksvc='kubectl get svc  -o wide'
alias ksvcw='kubectl get svc -w'
alias kdep='kubectl get deploy  -o wide'
alias kdepw='kubectl get deploy -w'
alias kall='kubectl get all -o wide'
alias kalln='kubectl get all --all-namespaces'
alias kno='kubectl get no -o wide'
alias kdesc='kubectl describe'
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

## Services

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

### Load Balancer Local Setup

1. Apply the service
2. Observe `kubectl get svc`, the External IP for LoadBalancer service would be `<Pending>`
3. Run `minikube tunnel`
4. Re-run `kubectl get svc`, you'll see External IP address assigned.
5. Run `curl -s http://localhost:8080/api/v1/pharmacies | json origin` multiple times, you'll see variations in origin value i.e. load balancing.