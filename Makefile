NS:=texastribune
APP:=support
IMAGE=${NS}/${APP}
DOCKER_ENV_FILE?=env-docker
.PHONY: build

run: build
	-docker volume rm ${APP}_node_modules-vol
	-docker volume create --name ${APP}_node_modules-vol
	docker run --rm \
		--volume=$$(pwd):/app \
		--publish=4567:4567 \
		--publish=35729:35729 \
		--interactive \
		--tty \
		--env-file=${DOCKER_ENV_FILE} \
		--volume=${APP}_node_modules-vol:/app/node_modules \
		--name=${APP} ${IMAGE} bash

build:
	docker build --tag=${IMAGE} .
