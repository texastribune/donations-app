APP=donations
NS=texastribune

.PHONY: build

build:
	docker build --tag=${NS}/${APP} .

debug:
	docker run --volumes-from=${APP} --interactive=true --tty=true ${NS}/${APP} bash

run:
	docker run --rm --name=${APP} --detach=true --publish=80:8000 ${NS}/${APP}

clean:
	docker stop ${APP} && docker rm ${APP}

interactive:
	docker run --env-file=env \
		--volume=$$(pwd)/.google_client_secrets.json:/root/.google_client_secrets.json \
		--volume=$$(pwd)/.google_drive_oauth2.json:/root/.google_drive_oauth2.json --rm \
		--interactive --volume=$$(pwd):/workdir \
		--workdir=/workdir --tty --name=${APP} ${NS}/${APP} bash

data-container:
	docker run --env-file=env \
		--volume=$$(pwd)/.google_client_secrets.json:/root/.google_client_secrets.json \
		--volume=$$(pwd)/.google_drive_oauth2.json:/root/.google_drive_oauth2.json \
		--name=donations-data \
		${NS}/${APP}
