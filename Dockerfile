FROM node:16-alpine

RUN mkdir /build
WORKDIR /build
COPY package.json yarn.lock /build/
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN yarn
COPY . /build
RUN yarn codegen
RUN yarn build
ENV NODE_ENV=production

EXPOSE 3000
CMD yarn start
