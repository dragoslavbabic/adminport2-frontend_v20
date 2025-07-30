import { PostgresUser } from './postgres-user.model';

export function mapApiPostgresUser(api: any): PostgresUser {
  return {

    pgDatum: api.pgDatum ?? null,
    pgInfo: api.pgInfo ?? null,
    studregUserName: api.studregUserName ?? null,
    id: Number (api.id) || 0,
    rawPgUsername: api.rawPgUsername,
    rawPgIme: api.rawPgIme,
    rawPgPrezime: api.rawPgPrezime ?? null,
    rawPgAdresa: api.rawPgAdresa ?? null,
    rawPgTelefon: api.rawPgTelefon ?? null,
    rawPgIndeks: api.pgIndeks ?? null,
    rawPgKomentar: api.rawPgKomentar ?? null,
    rawPgInstitucija: api.pgInstitucija ?? null,
  };
}
