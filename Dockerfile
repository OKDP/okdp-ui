ARG NODE_IMAGE=cimg/node:22.0.0
ARG NGINX_IMAGE=nginx:1.27.3-alpine

FROM ${NODE_IMAGE} AS build

ARG ANGULAR_VERSION=18
ARG OKDP_UI_VERSION=0.1.0-snapshot

LABEL name="OKDP UI" \
      description="OKDP UI" \
      vendor="okdp.io" \
      version="${OKDP_UI_VERSION}"

USER root

WORKDIR /workspace

COPY . .

RUN npm install --legacy-peer-deps \
    && npm install -g @angular/cli@${ANGULAR_VERSION}

RUN ng build --aot=true --configuration=production

FROM ${NGINX_IMAGE}

COPY --from=build /workspace/dist/okdp-ui/ /usr/share/nginx/html/

EXPOSE 80

# Run the application in the foreground
CMD ["nginx", "-g", "daemon off;"]
