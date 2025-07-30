import { LdapUser } from './ldap-user.model';
import { PostgresUser } from './postgres-user.model';

export interface User {
  id: string;
  username: string;
  lastName: string;
  fullName?: string;
  activeTo?: string;
  index?: string | null;
  institution?: string | null;
  status?: string | null;
  blocked?: boolean;
  shadowExpire?: number;
  isActive?: boolean;
  studRegUsername?: string | null;

  // Za kartice:
  ldap?: LdapUser;
  postgres?: PostgresUser;
}
