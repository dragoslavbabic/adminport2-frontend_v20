import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {jwtInterceptor} from './app/auth/service/jwt.interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideRouter(routes),
    // ... ostali provideri
  ]
});
