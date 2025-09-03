import { LdapUser } from './ldap-user.model';
import {PostgresUser, UserDTO} from './postgres-user.model';

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
  pgInfo?: string | null;

  // Za kartice:
  ldap?: LdapUser;
  postgres?: UserDTO;
}
