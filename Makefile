NS:=texastribune
APP:=support
IMAGE=${NS}/${APP}
AWS_CLI_CONTAINER:=aws-cli
AWS_CLI_IMAGE:=fstab/aws-cli
DOCKER_ENV_FILE?=env-docker

run: main-image
	-docker volume rm ${APP}_node_modules-vol
	-docker volume create --name ${APP}_node_modules-vol
	docker run --rm \
		--volume=$$(pwd):/app \
		--publish=4567:4567 \
		--publish=35729:35729 \
		--interactive \
		--tty \
		--volume=${APP}_node_modules-vol:/app/node_modules \
		--name=${APP} ${IMAGE} bash

main-image:
	docker build --tag=${IMAGE} .

deploy:
	docker start ${AWS_CLI_CONTAINER} || \
		docker run -t -i \
		--env-file=${DOCKER_ENV_FILE} \
		--name=${AWS_CLI_CONTAINER} \
		${AWS_CLI_IMAGE}
