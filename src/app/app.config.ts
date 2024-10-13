import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { apiInterceptorInterceptor } from './interceptors/api-interceptor.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([apiInterceptorInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(ReactiveFormsModule, MatSnackBarModule),
  ],
};
