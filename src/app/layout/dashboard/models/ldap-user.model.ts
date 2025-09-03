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
  studregUserName: string;
  ldapInstitucija: string;
  ldapStatus: string;
  ldapIndeks: string;
  isActive: boolean;
  ldapPgInfo: string;
}
