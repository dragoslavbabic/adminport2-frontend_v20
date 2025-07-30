import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {User} from '../models/user.model';
import {mapApiUser} from '../models/user.mapper';
import { environment } from '../../../../environments/environment';

// Prilagodi ako koristiš environment za baseURL!

@Injectable({ providedIn: 'root' })
export class KorisniciService {
  private readonly baseURL: string;
  private action: string;
  actionLoading: { [username: string]: boolean } = {}; // ili property u user objektu

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseUrl;
    this.action = '';
  }

  // SEARCH korisnika
  searchUsers(userData: string, attr: string): Observable<User[]> {
    // Encode user input zbog spec. karaktera!
    const params = new URLSearchParams({ user: userData, attr });
    return this.http.get<User[]>(`${this.baseURL}/get-user?${params.toString()}`)
      .pipe(
        map(responseArray => responseArray.map(mapApiUser))
    );
  }

  // RANDOM PASSWORD
  getRandomPass(): Observable<{ pass: string }> {
    return this.http.get<{ pass: string }>(`${this.baseURL}/getRandomPass`);
  }

  sshAccountAction(username: string, action: string): Observable<any> {
    // Dodaj encodeURIComponent radi sigurnosti!
    return this.http.get<any>(
      `${this.baseURL}/ssh-action?user=${encodeURIComponent(username)}&action=${action}`
    );
  }

  checkSpammer(username: string): Observable<{ spammer: boolean, Aktivan: boolean }> {
    return this.http.get<{ spammer: string, Aktivan: string }>(`${this.baseURL}/ssh/spammer/${encodeURIComponent(username)}`)
      .pipe(
        map(res => ({
          spammer: res.spammer === "true",
          Aktivan: res.Aktivan === "true"
        }))
      );
  }






}


