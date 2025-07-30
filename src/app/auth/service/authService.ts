import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, map, catchError, tap} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class authService {
  private http = inject(HttpClient);
  private baseURL: string;
  constructor() {
    this.baseURL = environment.baseUrl;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.baseURL + '/auth/login', { username, password }, { observe: 'response' })
      .pipe(
        map(response => {
          const accessToken = response.headers.get('accessToken');
          const refreshToken = response.headers.get('refreshToken');
          if (accessToken && refreshToken) {
            sessionStorage.setItem('jwt', accessToken);
            sessionStorage.setItem('refresh', refreshToken);
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
  }

  refreshToken(): Observable<{ accessToken: string, refreshToken: string }> {
    const refreshToken = sessionStorage.getItem('refresh');
    return this.http.post<{ accessToken: string, refreshToken: string }>(
      this.baseURL + '/auth/refresh-token',
      { refreshToken }
    ).pipe(
      tap(res => {
        // Čuvaj oba tokena, ako dobiješ oba!
        if (res.accessToken) sessionStorage.setItem('jwt', res.accessToken);
        if (res.refreshToken) sessionStorage.setItem('refresh', res.refreshToken);
      })
    );
  }

  setToken(token: string) {
    sessionStorage.setItem('jwt', token);
  }

  setRefreshToken(token: string) {
    sessionStorage.setItem('refresh', token);
  }

  clearTokens() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('refresh');
  }

  logout() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('refresh');
  }

  getToken() {
    return sessionStorage.getItem('jwt');
  }
}
