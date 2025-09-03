import { User } from './user.model';
import { mapApiLdapUser } from './ldap-user.mapper';
import { mapApiPostgresUser } from './postgres-user.mapper';

export function mapApiUser(api: any): User {
  // Log za proveru, možeš ga ostaviti ili izbrisati kasnije
  // console.log('Stize objekat:', api);

  // Pošto nema zavučenih objekata, šalji ceo api u oba mapera!
  const ldap = mapApiLdapUser(api);
  const postgres = mapApiPostgresUser(api);

  return {
    id: postgres?.id?.toString() ?? ldap?.ldapUsername ?? '',
    username: ldap?.ldapUsername ?? '',
    fullName: ldap?.ldapFullName,
    lastName: ldap?.ldapLastName,
    activeTo: ldap?.ldapRadiusExpiration,
    shadowExpire: ldap?.ldapShadowExpire,
    index: ldap?.ldapIndeks ?? null,
    institution: ldap?.ldapInstitucija ?? null,
    status: ldap?.ldapStatus ?? null,
    blocked: !!ldap?.ldapShadowExpire && ldap.ldapShadowExpire > 0,
    isActive: !!ldap?.isActive,
    studRegUsername: ldap?.studregUserName,
    pgInfo: ldap?.ldapPgInfo,

    ldap,
    //postgres,
  };
}
