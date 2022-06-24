image:
	docker build -t darshah/k8s_learn:$(VERSION) .

test_con:
	docker run --rm -d --name=learn -e VERSION=v1 -p 4224:80 darshah/k8s_learn:v1

test_api:
	curl http://localhost:4224/

