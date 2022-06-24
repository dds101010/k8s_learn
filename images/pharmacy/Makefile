image:
	docker build -t darshah/k8s_learn_pharmacy:$(VERSION) .

container:
	docker run --rm -d --name=pharmacy -e VERSION=v1 -p $(PORT):80 darshah/k8s_learn_pharmacy:$(VERSION)

dev:
	PORT=$(PORT) VERSION=dev node app.js