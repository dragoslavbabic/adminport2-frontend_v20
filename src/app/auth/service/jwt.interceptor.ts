import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { authService } from './authService';
import { catchError, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('JWT INTERCEPTOR FIRED:', req.url); // <- OVO!
  const auth = inject(authService);

  // Login & refresh-token requeste preskoči!
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh-token')
  ) {
    console.log('REDIRECTOR REDIRECTOR REDIRECTOR');
    return next(req);
  }

  const token = auth.getToken();
  let requestToSend = req;
  if (token) {
    requestToSend = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(requestToSend).pipe(
    catchError((err: HttpErrorResponse) => {
      console.log('CATCH ERROR:', err);
      // Proveri da li je error 401 i da li je token istekao
      if (
        err.status === 401 &&
        err.error?.error === 'expired_token'
      ) {
        console.log('jesmo li je uhvatili?');
        // Pozovi refresh token endpoint
        return auth.refreshToken().pipe(
          switchMap(tokens => {
            auth.setToken(tokens.accessToken);
            auth.setRefreshToken(tokens.refreshToken);
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
            });
            return next(retryReq);
          }),
          catchError(() => {
            auth.clearTokens();
            window.location.href = '/login';
            return throwError(() => err);
          })
        );
      }
      // Svi ostali errori normalno
      return throwError(() => err);
    })
  );
};
