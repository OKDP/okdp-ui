//export const HOME_PAGE_URI = '/home';
export const HOME_PAGE_URI = '/projects';
export const ERROR_PAGE_URI = '/error';
export const CATALOG_URI = 'catalogs';
export const KUBOCD_RELEASES_FETCH_POLLING_INTERVAL_MS = 30 * 1000;
export const NOTIFICATION_MESSAGE_VISIBILITY_TIMEOUT_MS = 60 * 1000;
export const KUBERNETES_OBJECT_PATTERN = '^[a-z0-9]([-a-z0-9]*[a-z0-9])?$';
export const REGISTRY_REPO_URL_PATTERN = /\/([^/:]+)(?=(:[^/]*)?$)/;

// Helper functions
export const nowIsoString = (): string => new Date().toISOString();
