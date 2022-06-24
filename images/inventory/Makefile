image:
	docker build -t darshah/k8s_learn_inventory:$(VERSION) .

container:
	docker run --rm -d --name=inventory -e VERSION=v1 -p $(PORT):80 darshah/k8s_learn_inventory:$(VERSION)

dev:
	PORT=$(PORT) VERSION=dev node app.js