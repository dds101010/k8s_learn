image:
	cd container; docker build -t darshah/k8s_learn:v1 .

image_v2:
	cd container; docker build -t darshah/k8s_learn:v2 .

test_con:
	docker run --rm -d --name=learn -e VERSION=v1 -p 4224:80 darshah/k8s_learn:v1

test_api:
	curl http://localhost:4224/

watch_k8s:
	watch -n1 "kubectl get all"

port_foward:
	kubectl port-forward deployment/hello-world-deployment 4224:80 