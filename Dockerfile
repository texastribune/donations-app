FROM ruby:2.2.2
MAINTAINER @x110dc

#RUN apt-get update
#RUN apt-get install -yq ruby2.1 ruby2.1-dev nodejs
#RUN apt-get install -yq rubygems
#RUN apt-get install -yq make
#RUN apt-get install -yq gcc
#RUN apt-get install -yq g++

WORKDIR /app
COPY Gemfile /app/
RUN gem install bundler
#RUN apt-get install -yq build-essential
#RUN apt-get install -yq zlib1g-dev
#RUN apt-get install -yq libxml2-dev libxslt1-dev
RUN bundle install

RUN set -ex \
  && for key in \
    7937DFD2AB06298B2293C3187D33FF9D0246406D \
    114F43EE0176B71C7BC219DD50A3051F888C628D \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done

ENV NODE_VERSION 0.12.7
ENV NPM_VERSION 2.13.3

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --verify SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
  && npm install -g npm@"$NPM_VERSION" \
  && npm cache clear

COPY data /app/data
COPY source /app/source
COPY config.rb /app/
VOLUME /app/build

CMD bundle exec middleman build
