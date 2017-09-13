NS:=texastribune
APP:=support

build:
	docker build --tag=${APP} .

run:
	docker run --rm \
		--publish=4567:4567 \
		--interactive \
		--tty \
		--env=LC_ALL=C.UTF-8 \
		--env=LANG=en_US.UTF-8 \
		--env=LANGUAGE=en_US.UTF-8 \
		--name=${APP} ${APP} \
		bash
