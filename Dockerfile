#
# Copyright 2026 The OKDP Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

ARG NODE_IMAGE=cimg/node:22.0.0
ARG NGINX_IMAGE=nginx:1.27.3-alpine

FROM ${NODE_IMAGE} AS build

ARG ANGULAR_VERSION=18

USER root

WORKDIR /workspace

COPY . .

RUN npm install --legacy-peer-deps \
    && npm install -g @angular/cli@${ANGULAR_VERSION}

RUN ng build --aot=true --configuration=production

FROM ${NGINX_IMAGE}

ARG okdp_ui_uid=1001
ARG OKDP_UI_VERSION=0.4.0

LABEL org.opencontainers.image.title="OKDP Control Plan UI" \
    org.opencontainers.image.version="${OKDP_UI_VERSION}" \
	org.opencontainers.image.description="A Control Plane UI for the OKDP platform" \
	org.opencontainers.image.url="https://okdp.io" \
	org.opencontainers.image.documentation="https://github.com/OKDP/okdp-ui/blob/main/README.md" \
	org.opencontainers.image.source="https://github.com/OKDP/okdp-ui" \
	org.opencontainers.image.vendor="okdp.io" \
	org.opencontainers.image.licenses="Apache-2.0"

COPY --from=build /workspace/dist/okdp-ui/ /usr/share/nginx/html/
# Replace the default privileged port (80) by an unprivileged one (4200)
# When using a non-root user, Nginx ignores 'user' directive but still shows a warning.
RUN sed -i -E -e 's/^(\s*)listen\s+80\s*;/\1listen 4200;/' \
              -e 's/^(\s*)listen\s+\[::\]:80\s*;/\1listen [::]:4200;/' /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf \
    && sed -i 's/^\(\s*user\s\+.*\)$/# \1/' /etc/nginx/nginx.conf \
    && chown -R ${okdp_ui_uid}:root /usr/share/nginx/html/config \
    && chown -R ${okdp_ui_uid}:root /var/cache/nginx /etc/nginx /run /var/run

EXPOSE 4200

USER ${okdp_ui_uid}

# Run the application in the foreground
CMD ["nginx", "-g", "daemon off;"]
