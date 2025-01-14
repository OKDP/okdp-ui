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
