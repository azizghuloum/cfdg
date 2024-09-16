FROM contextfree AS cfdg


FROM ubuntu:24.04

RUN apt update -y
RUN apt upgrade -y
RUN apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt install -y nodejs



RUN mkdir /app
WORKDIR /app
RUN mkdir cfdg
COPY --from=cfdg /context-free/cfdg.wasm ./cfdg
COPY --from=cfdg /context-free/cfdg.wasm.map ./cfdg
COPY --from=cfdg /context-free/cfdg.js ./cfdg
RUN ls -l ./cfdg
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY craco.config.js .

COPY tsconfig.json .
COPY ./public ./public
COPY ./src ./src

COPY docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
