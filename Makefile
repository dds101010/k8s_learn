watch_k8s:
	watch -n1 "kubectl get all"

port_foward:
	kubectl port-forward deployment/hello-world-deployment 4224:80 