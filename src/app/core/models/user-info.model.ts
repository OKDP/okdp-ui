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

export interface UserInfo {
  subject: string;
  name: string;
  login?: string;
  email: string;
  roles?: string[];
  groups?: string[];
  fromRecord(record: Record<string, any>): UserInfo;
}

export const userInfoConverter = {
  fromRecord(record: Record<string, any>): UserInfo {
    return {
      subject: record['sub'],
      name: record['name'],
      email: record['email'],
      login: record['email'],
      roles: Array.isArray(record['roles']) ? record['roles'] : [],
      groups: Array.isArray(record['groups']) ? record['groups'] : [],
    } as UserInfo;
  },
};
