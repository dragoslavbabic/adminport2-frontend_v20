import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {jwtInterceptor} from './app/auth/service/jwt.interceptor';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeSr from '@angular/common/locales/sr';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,} from '@angular/material/core';
//import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import localeSrCyrl from '@angular/common/locales/sr-Cyrl';

registerLocaleData(localeSr, 'sr');


/*export const SR_DATE_FORMATS = {
  parse: { dateInput: 'D. MMMM YYYY.' },
  display: {
    dateInput: 'D. MMMM YYYY.',
    monthYearLabel: 'MMMM YYYY.',
    dateA11yLabel: 'D. MMMM YYYY.',
    monthYearA11yLabel: 'MMMM YYYY.'
  }
};*/

registerLocaleData(localeSrCyrl);

export const SR_CYRL_DATE_FORMATS = {
  parse: { dateInput: 'd. MMMM y.' },
  display: {
    dateInput: 'd. MMMM y.',
    monthYearLabel: 'MMMM y',
    dateA11yLabel: 'd. MMMM y.',
    monthYearA11yLabel: 'MMMM y',
  },
};

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'sr' },
    //{ provide: DateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_LOCALE, useValue: 'sr' },
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE,  useValue: 'sr-Cyrl' },
    { provide: MAT_DATE_FORMATS, useValue: SR_CYRL_DATE_FORMATS },
    // ... ostali provideri
  ]
});
