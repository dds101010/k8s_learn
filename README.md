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
kubectl explain pod.spec.containers.livenessProbe # ⭐ very important

kubectl port-forward deployment/hello-world-deployment 4224:80
kubectl get all -n metallb-system # for specific namespace
kubectl get all --all-namespaces # for all namespaces
kubectl explain service.spec.type # 😲
kubectl get po --show-labels
kubectl get po --selector="env=prod,tech=boot"
kubectl get po -l env=prod,tech=boot # same effect as above
docker system df
kubectl get sc,pv,pvc # get multiple resources in one command
```

## Dry-run

```sh
kubectl run nginx --image=nginx --dry-run=client -o yaml
kubectl create deployment --image=nginx nginx --dry-run -o yaml

```

### Quick dry-run using export
```sh
export do="--dry-run=client -o yaml"

kubectl run nginx --image nginx:alpine $do
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

## Imperative commands for creating resources

```sh
kubectl run redis --image=redis # pod
kubectl create deployment nginx --image=nginx --replicas=4 # deployment
kubectl scale deployment nginx --replicas=1 # scaling
kubectl expose pod redis --port=6379 --name redis-service # service
kubectl create service clusterip redis --tcp=6379:6379 # service (assumption for label selector: app=redis)

kubectl expose pod nginx --port=80 --name nginx-service --type=NodePort
kubectl create service nodeport nginx --tcp=80:80 --node-port=30080
```

## Deployment Strategies

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

### Access Service in same and another namespace
- In the same namespace, another service can be accessed just with service name itself
- If the service exists in another namespace, then: `service-name.namespace.svc.cluster.local` (cluster.local if both namespace exists in the same cluster)

## Volumes

### Empty Directory Volume
- files: [empty_dir_volume_depl.yaml](k8s/empty_dir_volume_depl.yaml)
- refs: https://dev.to/techworld_with_nana/difference-between-emptydir-and-hostpath-volume-types-in-kubernetes-286g

An emptyDir volume is first created when a Pod is assigned to a Node, and exists as long as that Pod is running on that node.

As the name says, it is initially empty. All Containers in the same Pod can read and write in the same emptyDir volume.

When a Pod is restarted or removed, the data in the emptyDir is lost forever.

Some use cases for an emptyDir are:
- scratch space, for a sort algorithm for example
- when a long computation needs to be done in memory
- as a cache

[![asciicast](https://asciinema.org/a/sXDD9QqLCqwR6Cm97p5jshSXz.svg)](https://asciinema.org/a/sXDD9QqLCqwR6Cm97p5jshSXz)

### Host Path Volume
- files: [hostpath_volume.yaml](k8s/hostpath_volume.yaml)

A hostPath volume mounts a file or directory from the node's filesystem into the Pod. Note that if you're running k8s from Minikube, this is not a directory from your local system but a directory/file from the minikube node.

Why we need this? - Not clear yet!

### Difference between hostpath and emptydir?
| hostPath | emptyDir |
| --- | --- |
| Scope: Node | Scope: Pod |
| To share common space amongst pods of a node | To share common space amongst containers of a pod |

### Persistent Volume and Persistent Volume Claim
- ref: https://www.alibabacloud.com/blog/kubernetes-volume-basics-emptydir-and-persistentvolume_594834
- files: [persistent_volume.yaml](k8s/persistent_volume.yaml), [persistent_volume_depl.yaml](k8s/persistent_volume_depl.yaml)

If you need persistent volumes you use: PersistentVolume and PersistentVolumeClaim

This is a 3 step process:

You or the Kubernetes administrator defines a PersistentVolume ( Disk space available for use )
You define a PersistentVolumeClaim - you claim usage of a part of that PersistentVolume disk space.
You create a Pod that refers to your PersistentVolumeClaim

**Persistent Volume Access Modes**
  - ReadWriteOnce - can be mounted to single node
  - ReadOnlyMany - can be mounted to multiple nodes
  - ReadWriteMany - can be mounted to multiple nodes
  - ReadWriteOncePod - can be mounted to only one pod under a cluster

#### **ELI5**

1. StorageClass
    - These are generally defined by your Cloud providers. Each class defines the type of storage they offer, like fast, super-fast, medium, slow (may be effecting the overall cost you incur based on your choice of storage)
2. PersistentVolume
    - These are defined by your administrators. They basically say, we have 10 GB of super-fast storage available that can be accessed by only one node at a time.
      - 10 GB -> `spec.capacity.storage`
      - super-fast -> `spec.storageClassName`
      - accessed by only one node at a time -> `spec.accessModes`
3. PersistentVolumeClaim
    - This is basically the cluster users asking for persistent storage. like you're deploying an application and you say, hey I want 100 MB of super-fast storage that can be accessed by multiple nodes simultaneously.

## ConfigMaps
- files: [configmap_1.yaml](k8s/configmap_1.yaml)

> ConfigMaps consumed as environment variables are not updated automatically and require a pod restart. ConfigMaps mounted as Volumes are synced periodically

Can be mounted three ways:

1. As environment variable

```yaml
env:
  - name: USER_FULL_NAME
    valueFrom:
      configMapKeyRef:
        name: person-details-cm
        key: name
```

2. All Properties mounted as Volume - In this case there will be one file for each property

```yaml
volumeMounts:
  - mountPath: "/all_details"
    name: all-details-volume
...
volumes:
  - name: all-details-volume
    configMap:
      name: person-details-cm
```

3. Specific set of properties mounted as Volume

```yaml
volumeMounts:
  - mountPath: "/address"
    name: address-details-volume
...
volumes:
  - name: address-details-volume
    configMap:
      name: person-details-cm
      items:
        - key: "address"
          path: "address.properties"
```

### Scaling replicaset 

1. Update the YAML file and do `kubectl apply -f replicaset.yaml`. (This only works if replicaset was created using YAML)
2. Edit the replicaset i.e. `kubectl edit new-replica-set`, update the count and save
3. Use scale command i.e. `kubectl scale --replicas=2 replicaset new-replica-set`

## Service Accounts

- User account is an account used by human to communicate with k8s cluster.
- Service account is an account used by a service to communicate with k8s cluster (i.e. prometheus)
  - bearer token (stored in a secret)

- each namespace has its own `default` service account (which is restricted in terms of access available to it).
- this default service account is mounted by default if no other service account is specified.

```sh
k create sa dashboard-sa
k create token dashboard-sa

kubectl set serviceaccount deploy/web-dashboard dashboard-sa # or
k explain deployment.spec.template.spec.serviceAccountName
```

## Resources

parameter | values | implication
---- | ---- | -----
CPU | 0.5, 1, 2, 5 | 1 == 1 AWS vCPU, 1 GCP Core, 1 Azure Core, 1 Hyperthread
Memory | 256Mi, 1Gi, 1G | 1 Ki = 1024 bytes, 1 K = 1000 bytes
Disk | | 
