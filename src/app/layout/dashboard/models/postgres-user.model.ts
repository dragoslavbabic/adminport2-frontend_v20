export interface PostgresUser {
  pgDatum?: string | null;
  pgInfo?: string | null;
  studregUserName?: string | null;
  id: number;
  rawPgUsername?: string;
  rawPgIme?: string;
  rawPgPrezime?: string;
  rawPgAdresa?: string;
  rawPgTelefon?: string;
  rawPgIndeks?: string;
  rawPgKomentar?: string;
  rawPgInstitucija?: string;
  rawPgStatus?: string;
}
