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
  components: string[];
  name: string;
  templates: string[];
}

export interface Component {
  kind: string;
  spec: {
    allowCreateNamespace: boolean;
    allowValues: boolean;
    catalogs: string[];
    config: {
      install: {
        createNamespace: boolean;
        remediation: {
          remediateLastFailure: boolean;
          retries: number;
        };
      };
      timeout: string;
      upgrade: {
        remediation: {
          remediateLastFailure: boolean;
          retries: number;
        };
      };
    };
    contextSchema: {
      File: string;
      Json: string;
    };
    dependsOn: string[];
    name: string;
    /** List of paramters as key/value pairs */
    parameters: Record<string, any>;
    parametersSchema: {
      File: string;
      Json: string;
    };
    protected: boolean;
    roles: string[];
    source: {
      allowedVersions: string[];
      defaultVersion: string;
      gitRepository: {
        name: string;
        namespace: string;
        path: string;
        unmanaged: boolean;
      };
      helmRepository: {
        certSecretRef: string;
        chart: string;
        interval: string;
        secretRef: string;
        url: string;
      };
      ociRepository: {
        certSecretRef: string;
        insecure: boolean;
        interval: string;
        secretRef: string;
        url: string;
      };
    };
    suspended: boolean;
    usage: string | Record<string, any>;
    values: string | Record<string, any>;
    version: string;
  };
  status: {
    error: string;
    file: string;
    parametersSchema: object;
    path: string;
    releases: string[];
    title: string;
  };
}

export interface ComponentReleasePayload {
  component: {
    /** Additional configuration */
    config?: Record<string, any>;
    name: string;
    parameterFiles?: {
      document?: string;
      file?: string;
      unwrap?: string;
      wrap?: string;
    }[];
    /** List of paramters as key/value pairs */
    parameters?: Record<string, any>;
    protected?: boolean;
    source?: {
      version: string;
    };
    suspended?: boolean;
    /** List of values as key/value pairs */
    values?: Record<string, any>;
    version: string;
  };
  dependsOn?: string[];
  enabled?: boolean;
  name: string;
  namespace?: string;
  roles?: string[];
}

export interface ComponentReleaseRequest {
  comment: string;
  componentReleases: ComponentReleasePayload[];
  gitRepoFolder: string;
}

export interface ComponentReleaseResponse {
  kind: string;
  spec: {
    component: {
      Ref: {
        Name: string;
        Version: string;
      };
      Source: {
        version: string;
      };
      /** Additional configuration */
      config: Record<string, any>;
      parameterFiles: {
        Document?: string;
        File?: string;
        Unwrap?: string;
        Wrap?: string;
      }[];
      /** List of paramters as key/value pairs */
      parameters: Record<string, any>;
      protected: boolean;
      suspended: boolean;
      /** List of values as key/value pairs */
      values: Record<string, any>;
    };
    dependsOn: string[];
    enabled: boolean;
    helmReleaseName__: string;
    name: string;
    namespace: string;
    roles: string[];
  };
  status: {
    catalogs: string[];
    dependencies: string[];
    error: string;
    file: string;
    /** List of values as key/value pairs */
    parameters: Record<string, any>;
    path: string;
    usage: string;
  };
}

export interface FlatComponent {
  catalogs: string[];
  componentName: string;
  componentReleaseName: string;
  componentVersion: string;
  enabled: boolean;
  packageName: string;
  packageVersion: string;
  protected: boolean;
  suspended: boolean;
  templateName: string;
  templateReleaseName: string;
  templateVersion: string;
  /** @default "" */
  usage: string;
}

export interface GitCommit {
  /** The hash of the commit */
  commit?: string;
  /** A commit Message */
  commitMessage?: string;
  /** Email of the committer */
  committerEmail?: string;
  /** Name of the committer */
  committerName?: string;
  /**
   * Whether to force commit
   * @default false
   */
  force?: boolean;
  /** Target file path of the commit in the git repository */
  targetPath?: string;
}

export interface KadInstance {
  apiUrl: string;
  authBearer: string;
  id: string;
  /** @default true */
  insecureSkipVerify: boolean;
  name: string;
}

export interface ServerError {
  message: string;
  status: number;
  type: string;
}

export interface Service {
  flatComponents: FlatComponent[];
  /** @default false */
  isComposition: boolean;
  name: string;
}

export interface TemplateRelease {
  kind: string;
  spec: {
    enabled: boolean;
    name: string;
    template: {
      Ref: {
        Name: string;
        Version: string;
      };
      /** List of paramters as key/value pairs */
      parameters: Record<string, any>;
    };
  };
  status: {
    catalogs: string[];
    children: string[];
    error: string;
    file: string;
    /** List of paramters as key/value pairs */
    parameters: Record<string, any>;
    path: string;
    usage: string;
  };
}

export interface UserProfile {
  email: string;
  groups: string[];
  login: string;
  name: string;
  roles: string[];
  sub: string;
}
