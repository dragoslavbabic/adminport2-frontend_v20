import {UserDTO} from './postgres-user.model';

export function mapApiPostgresUser(api: any): UserDTO {
  //console.log('Ulaz u maper:', api);
  return {

    //datum: api.pgDatum ?? null,
    //info: api.pgInfo ?? null,
    id: Number (api.id) || 0,
    username: api.rawPgUsername,
    ime: api.rawPgIme,
    prezime: api.rawPgPrezime ?? null,
    adresa: api.rawPgAdresa ?? null,
    telefon: api.rawPgTelefon ?? null,
    indeks: api.rawPgIndeks ?? null,
    komentar: api.rawPgKomentar ?? null,
    status: api.rawPgStatus ?? null,
    institucija: api.rawPgInstitucija ?? null,
  };
}
