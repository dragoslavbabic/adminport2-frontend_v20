import { LdapUser } from './ldap-user.model';

export function mapApiLdapUser(api: any): LdapUser {
  return {
    ldapUsername: api.ldapUsername ?? '',
    ldapFullName: api.ldapFullName ?? '',
    ldapLastName: api.ldapLastName ?? '',
    ldapRadiusExpiration: api.ldapRadiusExpiration ?? '',
    ldapUnsSuspendDelivery: !!api.ldapUnsSuspendDelivery,
    ldapUnsAltUid: Array.isArray(api.ldapUnsAltUid) ? api.ldapUnsAltUid : [],
    ldapShadowExpire: typeof api.ldapShadowExpire === 'number' ? api.ldapShadowExpire : Number(api.ldapShadowExpire) || 0,
    ldapMailHost: api.ldapMailHost ?? '',
    ldapHomeDirectory: api.ldapHomeDirectory ?? '',
    ldapUnsService: Array.isArray(api.ldapUnsService) ? api.ldapUnsService : [],
    ldapCreateTimestamp: api.ldapCreateTimestamp ? new Date(api.ldapCreateTimestamp) : new Date(),
    noShadowLastChange: !!api.noShadowLastChange,
    isActive: api.isActive ?? false,
    studregUserName: api.studregUserName ?? '',
    ldapIndeks: api.pgIndeks ?? '',
    ldapInstitucija: api.pgInstitucija ?? '',
    ldapStatus: api.pgStatus ?? '',
    ldapPgInfo: api.pgInfo ?? '',
  };
}
