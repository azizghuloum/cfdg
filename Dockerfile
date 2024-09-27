FROM contextfree AS cfdg


FROM ubuntu:24.04

RUN apt update -y
RUN apt upgrade -y
RUN apt install curl vim -y
RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt install -y nodejs


RUN mkdir /app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

RUN mkdir /cfdg
# COPY --from=cfdg /context-free/web/cfdg.wasm /cfdg
# COPY --from=cfdg /context-free/web/cfdg.wasm.map /cfdg
COPY --from=cfdg /context-free/web/cfdg.js /cfdg/cfdg.js
RUN echo "self.CFDG = Module;" >> /cfdg/cfdg.js
#run echo "self.module = self.module || {};" >> /cfdg/cfdg.cjs
#RUN echo "self.module.exports = Module;" >> /cfdg/cfdg.cjs
COPY ./cfdg/package.json /cfdg
COPY ./cfdg/cfdg.d.ts /cfdg

RUN npm link /cfdg

COPY vite.config.ts .
COPY tsconfig.json .
COPY tsconfig.app.json .
COPY tsconfig.node.json .
COPY index.html .
COPY ./public ./public
COPY ./src ./src
RUN npm run build

COPY docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
