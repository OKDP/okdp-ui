/**
 * Copyright 2026 The OKDP Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
