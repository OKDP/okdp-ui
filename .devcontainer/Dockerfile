FROM cimg/node:22.0.0

LABEL name="Angular dev environment" \
      description="This image can be used to create a dev environment for building Angular." \
      vendor="angular" \
      version="1.0"

EXPOSE 4200

USER root

RUN npm install -g @angular/cli@18

CMD ["tail", "-f", "/dev/null"]
