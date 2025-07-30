import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostgresStatus} from '../models/postgres-status.model';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class StatusService {
  private readonly baseURL: string;
  constructor(private http: HttpClient) {
    this.baseURL = environment.baseUrl;

  }
  getStatusi(): Observable<PostgresStatus[]> {
    return this.http.get<PostgresStatus[]>(this.baseURL + '/status');
  }
}
