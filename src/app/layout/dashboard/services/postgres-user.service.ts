import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostgresUser } from '../models/postgres-user.model';
import {environment} from '../../../../environments/environment';
import {PostgresInstitucija} from '../models/postgres-institucija.model';
import {PostgresStatus} from '../models/postgres-status.model';


@Injectable({ providedIn: 'root' })
export class PostgresUserService {
  private readonly baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseUrl;

  }

  getUser(username: string): Observable<PostgresUser | null> {
    return this.http.get<PostgresUser | null>(this.baseURL + `/postgres/user/mapper/${username}`);
  }

  saveUser(user: PostgresUser): Observable<any> {
    return this.http.post(this.baseURL + '/postgres/user/', user);
  }

  getInstitucije(): Observable<PostgresInstitucija[]> {
    return this.http.get<PostgresInstitucija[]>(this.baseURL + '/institucija');
  }

  getStatusi(): Observable<PostgresStatus[]> {
    return this.http.get<PostgresStatus[]>(this.baseURL + '/status');
  }
}
