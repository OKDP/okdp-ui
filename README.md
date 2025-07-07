<p align="center">
    <img width="400px" height=auto src="https://okdp.io/logos/okdp-inverted.png" />
</p>

OKDP UI for [OKDP Platform](https://okdp.io)

> [!NOTE]
> The application is currently in the early development stage and is subject to significant changes.

## Before commit:

```
yarn lint --fix
```

## Run in local:

```
ng serve --port=4200 --host=127.0.0.1
```

## Docker compose

```
docker-compose up --build
```

## Helm

helm package ./helm/okdp-ui
helm push okdp-ui-0.2.0-snapshot.tgz oci://quay.io/okdp/charts

```
docker build -t quay.io/okdp/okdp-ui:0.1.0-snapshot .
docker push quay.io/okdp/okdp-ui:0.1.0-snapshot
helm upgrade --install okdp-ui \
     --namespace okdp-ui \
     --create-namespace helm/okdp-ui \
     --values helm/okdp-ui/values.keycloak.yaml
```

# Versioning

1. [Update the file package.json](./package.json)

Set new version and/or new helmVersion:

```
{
  "name": "okdp-ui",
  "version": "0.3.0",
  "helmVersion": "0.3.0",
```

2. Run the following command:

npm run setversion

