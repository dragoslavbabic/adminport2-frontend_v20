import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {PostgresUser, UserCreateDTO, UserDTO, UserUpdateDTO} from '../models/postgres-user.model';
import {environment} from '../../../../environments/environment';
import {PostgresInstitucija} from '../models/postgres-institucija.model';
import {PostgresStatus} from '../models/postgres-status.model';
import { mapApiPostgresUser } from '../models/postgres-user.mapper';


@Injectable({ providedIn: 'root' })
export class PostgresUserService {
  private readonly baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseUrl;

  }

/*  getUser(username: string): Observable<PostgresUser | null> {
    return this.http.get<PostgresUser | null>(this.baseURL + `/postgres/user/mapper/${username}`);
  }*/

  getUser(username: string): Observable<UserDTO | null> {
    return this.http.get<any>(this.baseURL + `/postgres/user/mapper/${username}`).pipe(
      map((apiUser: any) => apiUser ? mapApiPostgresUser(apiUser[0]) : null)
    );
  }

  saveUser(user: PostgresUser): Observable<any> {
    return this.http.post(this.baseURL + '/postgres/user/', user);
  }

  addUser(data: UserCreateDTO): Observable<UserDTO> {
    return this.http.post<any>(this.baseURL + '/postgres/user/', data).pipe(
      map(apiUser => mapApiPostgresUser(apiUser))
    );
  }

  updateUser(user: UserUpdateDTO): Observable<UserDTO> {
    // ako backend očekuje id u URL-u:
    return this.http.put<any>(this.baseURL + `/postgres/user/${user.id}`, user).pipe(
      map(apiUser => mapApiPostgresUser(apiUser))
    );
  }

  getInstitucije(): Observable<PostgresInstitucija[]> {
    return this.http.get<PostgresInstitucija[]>(this.baseURL + '/institucija');
  }

  getStatusi(): Observable<PostgresStatus[]> {
    return this.http.get<PostgresStatus[]>(this.baseURL + '/status');
  }
}
