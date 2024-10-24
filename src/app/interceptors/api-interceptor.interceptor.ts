import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  const showSuccessToast = (message: string) => {
    snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-toast'],
    });
  };

  const showErrorToast = (message: string) => {
    snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-toast'],
    });
  };

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        showSuccessToast('Request successful');
      }
    }),
    catchError((error: HttpErrorResponse) => {
      showErrorToast('An error occurred');
      return throwError(() => error);
    })
  );
};
