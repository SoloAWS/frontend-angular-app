import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface ApiErrorResponse {
  detail: string;
}

interface ApiSuccessResponse {
  status?: string;
}

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const token = localStorage.getItem('access_token');

  const modifiedReq = req.clone({
    headers: req.headers.set('Authorization', token ? `Bearer ${token}` : ''),
  });

  return next(modifiedReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        if (req.url.includes('/assets/i18n/')) {
          return;
        }

        const response = event.body as ApiSuccessResponse;
        if (event?.status) {
          toastr.success(`Status: ${event.status}`, 'Success', {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('/assets/i18n/')) {
        return throwError(() => error);
      }
      
      let errorMessage = 'An error occurred';

      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ApiErrorResponse;
        if (apiError.detail) {
          errorMessage = apiError.detail;
        }
      }

      toastr.error(errorMessage, 'Request Failed', {
        timeOut: 5000,
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        enableHtml: true,
      });

      return throwError(() => error);
    })
  );
};
