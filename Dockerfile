FROM node:14.17 AS build
WORKDIR /app
COPY . .
RUN npm install --no-optional
RUN npm run build:local

FROM bitnami/nginx:1.21
COPY ./nginx.conf /opt/bitnami/nginx/conf/server_blocks/nginx.conf
WORKDIR /app
COPY --from=build /app/build/ .
