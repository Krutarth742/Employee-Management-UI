import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AuthModule } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      ToastrModule.forRoot(),
      AuthModule.forRoot({
        domain: 'dev-8v7vvlbu53evh5jt.us.auth0.com', // e.g., dev-xxxxxxxx.us.auth0.com
        clientId: 'J0ZHewTbHlMs2WHLHtsyqKeSREmzh1dr', // e.g., aBcDeFgHiJkLmNoPqRsTuVwXyZ
        authorizationParams: {
          redirect_uri: 'http://localhost:4200/sign-in', // Use https if running with SSL
          audience: 'http://localhost:5235',
           scope: 'openid profile email',
        },
      })
    ),
  ],
};
