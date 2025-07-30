import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostgresInstitucija} from '../models/postgres-institucija.model';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class InstitucijaService {
  private readonly baseURL: string;
  constructor(private http: HttpClient) {
    this.baseURL = environment.baseUrl;

  }
  getInstitucije(): Observable<PostgresInstitucija[]> {
    return this.http.get<PostgresInstitucija[]>(this.baseURL + '/institucija');
  }
}
