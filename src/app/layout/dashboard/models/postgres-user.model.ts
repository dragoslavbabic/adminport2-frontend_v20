export interface PostgresUser {
  info?: string | null;
  id: number;
  username?: string;
  ime?: string;
  prezime?: string;
  adresa?: string;
  telefon?: string;
  indeks?: string;
  komentar?: string;
  institucija?: string;
  status?: string;
}

// postgres-user.model.ts
export interface InstitucijaDTO {
  id: number;
  naziv: string;
  // dodaj još polja ako imaš
}

export interface StatusDTO {
  id: number;
  naziv: string;
  // dodaj još polja ako imaš
}

export interface UserDTO {
  id: number;
  username: string;
  ime: string;
  prezime: string;
  adresa?: string;
  telefon?: string;
  indeks?: string;
  institucija: InstitucijaDTO | null;
  status: StatusDTO | null;
  komentar?: string;
  // dodaj još polja po potrebi
}

export interface UserCreateDTO {
  username: string;
  ime: string;
  prezime: string;
  adresa?: string;
  telefon?: string;
  indeks?: string;
  institucijaId?: number | null;
  statusId?: number | null;
  komentar?: string;
  datum?: string;
  // Bez id polja!
}

// user-update-dto.model.ts
export interface UserUpdateDTO {
  id: number;
  username: string;
  ime: string;
  prezime: string;
  adresa?: string;
  telefon?: string;
  indeks?: string;
  institucijaId?: number | null;
  statusId?: number | null;
  komentar?: string;
  datum?: string;
}
