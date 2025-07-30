import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


export interface RadiusLog {
  id: string;
  radiusDate: string;
  status: string;
  client: string;
  message: string;
  host: string | null;
  user: string;
  mac: string;
  error: string | null;
  ostatak: string;
  realm: string | null;
}

@Injectable({ providedIn: 'root' })
export class LogService {
  private readonly baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseUrl;

  }

  getRadiusLogsForUser(username: string): Observable<RadiusLog[]> {
    // Ako API traži username kao parametar (npr. `/elastic/radiuslog/dragance`)
    return this.http.get<RadiusLog[]>(this.baseURL + `/elastic/radiuslog/${username}`);
    // Ako je drugačije, prilagodi putanju
  }
}
