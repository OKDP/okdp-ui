FROM cimg/node:22.0.0

LABEL name="Angular dev environment" \
      description="Dev environment for building Angular application." \
      vendor="angular" \
      version="18"

EXPOSE 4200

USER root

RUN npm install -g @angular/cli@18

CMD ["tail", "-f", "/dev/null"]
