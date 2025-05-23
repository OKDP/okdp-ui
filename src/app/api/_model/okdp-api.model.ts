/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Catalog {
  credentials?: {
    dockerconfigjson?: string;
    robotAccountName?: string;
    robotAccountToken?: string;
  };
  description: string;
  id: string;
  name: string;
  packages: {
    name: string;
  }[];
  /** @format uri */
  repoUrl: string;
}

export interface Cluster {
  auth?: {
    bearer?: {
      /** @format uri */
      apiServer: string;
      bearerToken: string;
    };
    certificate?: {
      /** @format uri */
      apiServer: string;
      caCert: string;
      clientCert: string;
      clientKey: string;
    };
    kubeconfig?: {
      /** @format uri */
      apiServer: string;
      context: string;
      insecureSkipTlsVerify: boolean;
      path: string;
    };
  };
  env: string;
  id: string;
  name: string;
}

export interface GitRepository {
  credentials: {
    secretRef: string;
  };
  name: string;
  namespace: string;
  path: string;
  ref: string;
  /** @format uri */
  repoUrl: string;
}

export interface Package {
  /** The name of the package */
  name: string;
  /** The URL of OCR registry */
  repoUrl: string;
  /** A list of versions for the package */
  versions: string[];
}

/** Release is the Schema for the releases API. */
export interface Release {
  /**
   * APIVersion defines the versioned schema of this representation of an object.
   * Servers should convert recognized schemas to the latest internal value, and
   * may reject unrecognized values.
   * More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   */
  apiVersion: string;
  /**
   * Kind is a string value representing the REST resource this object represents.
   * Servers may infer this from the endpoint the client submits requests to.
   * Cannot be updated.
   * In CamelCase.
   * More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   */
  kind: string;
  /** Standard object metadata. */
  metadata: {
    /** Arbitrary metadata. */
    annotations?: Record<string, string>;
    /**
     * Creation timestamp.
     * @format date-time
     */
    creationTimestamp?: string;
    /**
     * Seconds allowed for graceful termination.
     * @format int64
     */
    deletionGracePeriodSeconds?: number;
    /**
     * Deletion timestamp.
     * @format date-time
     */
    deletionTimestamp?: string;
    /** List of finalizers. */
    finalizers?: string[];
    /** Prefix for generating a unique name. */
    generateName?: string;
    /**
     * Sequence number representing generation of desired state.
     * @format int64
     */
    generation?: number;
    /** Key-value pairs to categorize resources. */
    labels?: Record<string, string>;
    /** Managed fields tracking info (complex object). */
    managedFields?: object;
    /** Name of the resource. */
    name?: string;
    /** Namespace of the resource. */
    namespace?: string;
    /** References to owning resources. */
    ownerReferences?: {
      apiVersion?: string;
      kind?: string;
      name?: string;
      uid?: string;
    }[];
    /** Resource version for concurrency control. */
    resourceVersion?: string;
    /** Deprecated self-link URL. */
    selfLink?: string;
    /** Unique ID assigned by Kubernetes. */
    uid?: string;
  };
  /** ReleaseSpec defines the desired state of Release. */
  spec: {
    /**
     * To provide contextual variables
     * Refer to Context resource description for some explanation
     * Contexts are merged in the following order:
     * - The global default one (defined in Config)
     * - The namespace context (A context with a specific name, defined in config, present in the release namespace)
     * - This ordered list
     * Default: []
     */
    contexts?: {
      name: string;
      namespace?: string;
    }[];
    /**
     * If true, add  { install: { createNamespace: true } } to config map.
     * Must be set, as used in module.Render()
     * Default: false
     */
    createNamespace?: boolean;
    /** Group a set of parameters useful for debugging Release and Package */
    debug?: {
      /**
       * DumpContext instruct to save a representation of the context
       * in the Status. This for user debugging?
       */
      dumpContext?: boolean;
      /**
       * DumpParameters instruct to save a representation of the parameters
       * in the Status. This for user debugging?
       */
      dumpParameters?: boolean;
    };
    /**
     * The roles we depend on. (appended to the one of the underlying package)
     * Default: []
     */
    dependencies?: string[];
    /** Short description of this release. Single line only */
    description?: string;
    /** The package to deploy */
    package: {
      /**
       * CertSecretRef can be given the name of a Secret containing
       * either or both of
       *
       * - a PEM-encoded client certificate (`tls.crt`) and private
       * key (`tls.key`);
       * - a PEM-encoded CA certificate (`ca.crt`)
       *
       * and whichever are supplied, will be used for connecting to the
       * registry. The client cert and key are useful if you are
       * authenticating with a certificate; the CA cert is useful if
       * you are using a self-signed server certificate. The Secret must
       * be of type `Opaque` or `kubernetes.io/tls`.
       *
       * Note: Support for the `caFile`, `certFile` and `keyFile` keys have
       * been deprecated.
       */
      certSecretRef?: {
        /** Name of the referent. */
        name: string;
      };
      /**
       * Ignore overrides the set of excluded patterns in the .sourceignore format
       * (which is the same as .gitignore). If not provided, a default will be used,
       * consult the documentation for your version to find out what those are.
       */
      ignore?: string;
      /** Insecure allows connecting to a non-TLS HTTP container registry. */
      insecure?: boolean;
      /**
       * Interval at which the OCIRepository URL is checked for updates.
       * This interval is approximate and may be subject to jitter to ensure
       * efficient use of resources.
       * @default "5m"
       * @pattern ^([0-9]+(\.[0-9]+)?(ms|s|m|h))+$
       */
      interval: string;
      /**
       * The source will be handled by a child fluxCD OciRepository resource, which will be created by this operator
       * All following fields will be replicated in this object
       * The provider used for authentication, can be 'aws', 'azure', 'gcp' or 'generic'.
       * When not specified, defaults to 'generic'.
       * -kubebuilder:default:=generic
       */
      provider?: 'generic' | 'aws' | 'azure' | 'gcp';
      /**
       * ProxySecretRef specifies the Secret containing the proxy configuration
       * to use while communicating with the container registry.
       */
      proxySecretRef?: {
        /** Name of the referent. */
        name: string;
      };
      /** Part of OCI url oci://<repository>:<tag> */
      repository: string;
      /**
       * SecretRef contains the secret name containing the registry login
       * credentials to resolve image metadata.
       * The secret must be of type kubernetes.io/dockerconfigjson.
       */
      secretRef?: {
        /** Name of the referent. */
        name: string;
      };
      /**
       * ServiceAccountName is the name of the Kubernetes ServiceAccount used to authenticate
       * the image pull if the service account has attached pull secrets. For more information:
       * https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account
       */
      serviceAccountName?: string;
      /** This flag tells the controller to suspend the reconciliation of this source. */
      suspend?: boolean;
      /** Part of OCI url oci://<repository>:<tag> */
      tag: string;
      /**
       * The timeout for remote OCI Repository operations like pulling, defaults to 60s.
       * @default "60s"
       * @pattern ^([0-9]+(\.[0-9]+)?(ms|s|m))+$
       */
      timeout?: string;
      /**
       * Verify contains the secret name containing the trusted public keys
       * used to verify the signature and specifies which provider to use to check
       * whether OCI image is authentic.
       */
      verify?: {
        /**
         * MatchOIDCIdentity specifies the identity matching criteria to use
         * while verifying an OCI artifact which was signed using Cosign keyless
         * signing. The artifact's identity is deemed to be verified if any of the
         * specified matchers match against the identity.
         */
        matchOIDCIdentity?: {
          /**
           * Issuer specifies the regex pattern to match against to verify
           * the OIDC issuer in the Fulcio certificate. The pattern must be a
           * valid Go regular expression.
           */
          issuer: string;
          /**
           * Subject specifies the regex pattern to match against to verify
           * the identity subject in the Fulcio certificate. The pattern must
           * be a valid Go regular expression.
           */
          subject: string;
        }[];
        /**
         * Provider specifies the technology used to sign the OCI Artifact.
         * @default "cosign"
         */
        provider: 'cosign' | 'notation';
        /**
         * SecretRef specifies the Kubernetes Secret containing the
         * trusted public keys.
         */
        secretRef?: {
          /** Name of the referent. */
          name: string;
        };
      };
    };
    /** The Release configuration variables */
    parameters?: any;
    /**
     * If true, the webhook will prevent deletion
     * Default: false
     */
    protected?: boolean;
    /**
     * List of roles fulfilled by this release. (appended to the one of the underlying package)
     * Default: []
     */
    roles?: string[];
    /**
     * If yes, the default context(s) of the configs are not taken in account
     * ,Default: false
     */
    skipDefaultContext?: boolean;
    /** Allow to patch the HelmRelease.spec for each module */
    specPatchByModule?: Record<string, any>;
    /**
     * If true, HelmRelease update is suspended at KuboCD level
     * (This is NOT the helmRelease.spec.suspend flag, which may be set by Config part)
     * Default: false
     */
    suspended?: boolean;
    /**
     * The namespace to deploy in. (May also be a partial name for a multi-namespaces package)
     * Not required, as it can be setup another way, depending on the package
     * (i.e. the package has a fixed namespace, or several ones).
     * Default: Release.metadata.namespace
     */
    targetNamespace?: string;
  };
  /**
   * ReleaseStatus defines the observed state of Release.
   * As we want Status to be explicit about provided information, we don't use 'omitempty' in its definition.
   * (Except for 'context', as controlled by a debug flag)
   */
  status?: ReleaseStatus;
}

export interface ReleaseInfo {
  description?: string;
  git: {
    path: string;
    url: string;
  };
  name: string;
  namespace?: string;
  package: {
    repository: string;
    tag: string;
  };
}

/**
 * ReleaseStatus defines the observed state of Release.
 * As we want Status to be explicit about provided information, we don't use 'omitempty' in its definition.
 * (Except for 'context', as controlled by a debug flag)
 */
export interface ReleaseStatus {
  /** Context is the resulting context, if requested in debug options */
  context?: any;
  /** The result of the package template and release value */
  dependencies?: string[];
  /** HelmReleaseState describe the observed state of child HelmReleases by name */
  helmReleaseStates?: Record<
    string,
    {
      ready: string;
      status?: string;
    }
  >;
  missingDependency?: string;
  /** Parameters is the resulting parameters set, if requested in debug options */
  parameters?: any;
  phase?: string;
  /**
   * PrintContextsContexts is a string to list our context. Not technically used, but intended to be displayed
   * as printcolumn
   */
  printContexts?: string;
  /**
   * PrintDescription
   * Copy of the release description, or, if empty the (templated) package one
   */
  printDescription?: string;
  /** PrintProtected is a copy of Protected, with a Y/n flag. To be used in display */
  printProtected?: string;
  /**
   * Protected result of Release.spec.protected defaulted to package.spec.protected
   * It is the value checked by the webhook
   */
  protected?: boolean;
  /**
   * ReadyReleases is a string to display X/Y helmRelease ready. Not technically used, but intended to be displayed
   * as printcolumn
   */
  readyReleases?: string;
  /** The result of the package template and release value */
  roles?: string[];
  /**
   * Usage is the rendering of the Package.spec.usage[key]. Aimed to provide user information.
   * Key could 'html', 'text', some language id, etc...
   */
  usage?: Record<string, string>;
}

export interface ServerResponse {
  /** The response message from the server */
  message: string;
  /** The HTTP status code */
  status: number;
  /** The type of the server response */
  type: 'okdp_server' | 'registry' | 'git_repo' | 'k8s_cluster';
}

export interface UserProfile {
  email: string;
  groups: string[];
  login: string;
  name: string;
  roles: string[];
  sub: string;
}
