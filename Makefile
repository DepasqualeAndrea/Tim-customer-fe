include Makefile.env

build:
	docker build -t ${REGISTRY}/${REPOSITORY}/${IMAGE}:$(shell node -p "require('./package.json').version") --build-arg env=production -f ./Dockerfile .
build-old:
	docker build -t ${REGISTRY}/${REPOSITORY}/${IMAGE}:$(shell node -p "require('./package.json').version") --build-arg env=production-old -f ./Dockerfile .
deploy:
	make login
	docker push ${REGISTRY}/${REPOSITORY}/${IMAGE}:$(shell node -p "require('./package.json').version")
login:
	docker login ${REGISTRY} -u ${USER} -p ${TOKEN}
tag:
	git tag $(shell node -p "require('./package.json').version")
	git push origin $(shell node -p "require('./package.json').version")
full:
	npm run minor
	make build deploy
full-old:
	npm run patch
	make build-old deploy
