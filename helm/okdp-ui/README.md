# okdp-ui

![Version: 0.1.0-snapshot](https://img.shields.io/badge/Version-0.1.0--snapshot-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 0.1.0-snapshot](https://img.shields.io/badge/AppVersion-0.1.0--snapshot-informational?style=flat-square)

OKDP UI Helm chart

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Affinity for pod scheduling. |
| autoscaling.enabled | bool | `false` |  |
| autoscaling.maxReplicas | int | `100` |  |
| autoscaling.minReplicas | int | `1` |  |
| autoscaling.targetCPUUtilizationPercentage | int | `80` |  |
| fullnameOverride | string | `""` | Overrides the release name. |
| image.pullPolicy | string | `"Always"` | Image pull policy. |
| image.repository | string | `"quay.io/okdp/okdp-ui"` | Docker image registry. |
| image.tag | string | `"0.1.0-snapshot"` | Image tag. |
| imagePullSecrets | list | `[]` | Secrets to be used for pulling images from private Docker registries. |
| ingress.annotations | object | `{}` |  |
| ingress.className | string | `""` | Specify the ingress class (Kubernetes >= 1.18). |
| ingress.enabled | bool | `false` |  |
| ingress.hosts[0].host | string | `"chart-example.local"` |  |
| ingress.hosts[0].paths[0].path | string | `"/"` |  |
| ingress.hosts[0].paths[0].pathType | string | `"ImplementationSpecific"` |  |
| ingress.tls | list | `[]` |  |
| livenessProbe | object | `{"httpGet":{"path":"/","port":"http"},"initialDelaySeconds":60,"periodSeconds":30,"timeoutSeconds":10}` | Liveness probe for the okdp-ui container. |
| nameOverride | string | `""` | Override for the `okdp-ui.fullname` template, maintains the release name. |
| nodeSelector | object | `{}` | Node selector for pod scheduling. |
| podAnnotations | object | `{}` | Additional annotations for the okdp-ui pod. |
| podLabels | object | `{}` | Additional labels for the okdp-ui pod. |
| podSecurityContext | object | `{}` |  |
| readinessProbe | object | `{"httpGet":{"path":"/","port":"http"}}` | Readiness probe for the okdp-ui container. |
| replicaCount | int | `1` | Desired number of okdp-ui pods to run. |
| resources | object | `{}` |  |
| securityContext | object | `{}` | Security context for the container. |
| service.port | int | `4200` |  |
| service.type | string | `"ClusterIP"` |  |
| serviceAccount.annotations | object | `{}` | Annotations to add to the service account |
| serviceAccount.automount | bool | `false` | Automatically mount a ServiceAccount's API credentials? |
| serviceAccount.create | bool | `false` | Specifies whether a service account should be created |
| serviceAccount.name | string | `""` | If not set and create is true, a name is generated using the fullname template |
| tolerations | list | `[]` | Tolerations for pod scheduling. |
| ui | object | `{"auth":{"oauth2":{"clientId":"","issuer":"http://oidc.local/realms/master","redirectUri":"http://chart-example.local/index.html","requireHttps":false,"responseType":"code","scope":"openid profile email offline_access roles","showDebugInformation":true,"silentRefreshRedirectUri":"http://chart-example.local/silent-refresh.html"},"provider":"oauth2"},"catalogs":{"kad":["all"],"services":["all"]},"okdpApi":{"apiUrl":"http://okdp-api.local/api/v1","swaggerUrl":"http://okdp-api-swagger.local"}}` | okdp-ui configuration. For more properties check: https://github.com/OKDP/okdp-ui/blob/main/public/config/app.config.json |
| ui.auth.oauth2 | object | `{"clientId":"","issuer":"http://oidc.local/realms/master","redirectUri":"http://chart-example.local/index.html","requireHttps":false,"responseType":"code","scope":"openid profile email offline_access roles","showDebugInformation":true,"silentRefreshRedirectUri":"http://chart-example.local/silent-refresh.html"}` | For the list of the available options, check: https://manfredsteyer.github.io/angular-oauth2-oidc/docs/classes/AuthConfig.html |
| ui.auth.oauth2.clientId | string | `""` | Specify your OIDC client Id. The clientId should be public. |
| ui.auth.oauth2.issuer | string | `"http://oidc.local/realms/master"` | Specify the oidc endpoint. |
| ui.auth.oauth2.redirectUri | string | `"http://chart-example.local/index.html"` | Specify the redirect uri. Should ends with: /index.html |
| ui.auth.oauth2.responseType | string | `"code"` | Specify the responseType. |
| ui.auth.oauth2.scope | string | `"openid profile email offline_access roles"` | Specify the scopes as space separated values Example: "openid profile email roles" |
| ui.auth.oauth2.silentRefreshRedirectUri | string | `"http://chart-example.local/silent-refresh.html"` | Specify the redirect uri for silent refresh. Should ends with: /silent-refresh.html |
| ui.auth.provider | string | `"oauth2"` | Authentication provider. |
| ui.catalogs.kad | list | `["all"]` | kad catalog services to dispaly in the catalog page. |
| ui.catalogs.services | list | `["all"]` | kad catalog services to dispaly in the sidebar menu ui. |
| ui.okdpApi.apiUrl | string | `"http://okdp-api.local/api/v1"` | okdp-api rest endpoint. |
| ui.okdpApi.swaggerUrl | string | `"http://okdp-api-swagger.local"` | okdp-api swagger endpoint. |
| volumeMounts | list | `[]` | Additional volumeMounts on the output Deployment definition. |
| volumes | list | `[]` | Additional volumes on the output Deployment definition. |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.13.1](https://github.com/norwoodj/helm-docs/releases/v1.13.1)
