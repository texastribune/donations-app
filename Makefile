NS:=texastribune
APP:=support
IMAGE=${NS}/${APP}

run: build
	-docker volume rm ${APP}_node_modules-vol
	-docker volume create --name ${APP}_node_modules-vol
	docker run --rm \
		--volume=$$(pwd):/app \
		--publish=4567:4567 \
		--publish=35729:35729 \
		--interactive \
		--tty \
		--volume=${APP}_node_modules-vol:/app/node_modules \
		--name=${NS}-${APP} ${IMAGE} \
		bash

build:
	docker build --tag=${IMAGE} .
