// src/app/models/ldap-user.model.ts

export interface LdapUser {
  ldapUsername: string;
  ldapFullName: string;
  ldapLastName: string;
  ldapRadiusExpiration: string;
  ldapUnsSuspendDelivery: boolean;
  ldapUnsAltUid: string[];
  ldapShadowExpire: number;
  ldapMailHost: string;
  ldapHomeDirectory: string;
  ldapUnsService: string[];
  ldapCreateTimestamp: Date;
  noShadowLastChange: boolean;
  isActive: boolean;
}
