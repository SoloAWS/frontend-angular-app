import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { apiInterceptorInterceptor } from './api-interceptor.interceptor';

describe('apiInterceptorInterceptor', () => {
  let interceptor: HttpInterceptorFn;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let request: HttpRequest<unknown>;
  
  beforeEach(() => {
    // Create spy for ToastrService
    toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: ToastrService, useValue: toastrService }
      ]
    });
    
    interceptor = apiInterceptorInterceptor;
    request = new HttpRequest('GET', '/api/test');
  });

  it('should add Authorization header with token when token exists', (done) => {
    // Arrange
    const token = 'test-token';
    spyOn(localStorage, 'getItem').and.returnValue(token);
    
    const next: HttpHandlerFn = (req) => {
      // Assert request headers
      expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
      return of(new HttpResponse());
    };

    // Act & Assert
    TestBed.runInInjectionContext(() => {
      interceptor(request, next).subscribe(() => {
        done();
      });
    });
  });

  it('should add empty Authorization header when no token exists', (done) => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    const next: HttpHandlerFn = (req) => {
      // Assert request headers
      expect(req.headers.get('Authorization')).toBe('');
      return of(new HttpResponse());
    };

    // Act & Assert
    TestBed.runInInjectionContext(() => {
      interceptor(request, next).subscribe(() => {
        done();
      });
    });
  });

  it('should show success toast when response has status', (done) => {
    // Arrange
    const response = new HttpResponse({
      status: 200,
      body: { status: 'Success' }
    });
    
    const next: HttpHandlerFn = () => of(response);

    // Act & Assert
    TestBed.runInInjectionContext(() => {
      interceptor(request, next).subscribe(() => {
        expect(toastrService.success).toHaveBeenCalledWith(
          'Status: 200',
          'Success',
          {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right'
          }
        );
        done();
      });
    });
  });

  it('should show error toast with API error detail', (done) => {
    // Arrange
    const errorResponse = new HttpErrorResponse({
      error: { detail: 'Custom API Error' }
    });
    
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    // Act & Assert
    TestBed.runInInjectionContext(() => {
      interceptor(request, next).subscribe({
        error: () => {
          expect(toastrService.error).toHaveBeenCalledWith(
            'Custom API Error',
            'Request Failed',
            {
              timeOut: 5000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-right',
              enableHtml: true
            }
          );
          done();
        }
      });
    });
  });

  it('should show generic error toast when no error detail is provided', (done) => {
    // Arrange
    const errorResponse = new HttpErrorResponse({
      error: {}
    });
    
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    // Act & Assert
    TestBed.runInInjectionContext(() => {
      interceptor(request, next).subscribe({
        error: () => {
          expect(toastrService.error).toHaveBeenCalledWith(
            'An error occurred',
            'Request Failed',
            {
              timeOut: 5000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-right',
              enableHtml: true
            }
          );
          done();
        }
      });
    });
  });

  it('should propagate the error after showing toast', (done) => {
    // Arrange
    const errorResponse = new HttpErrorResponse({
      error: { detail: 'Test Error' }
    });
    
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    // Act & Assert
    TestBed.runInInjectionContext(() => {
      interceptor(request, next).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
          done();
        }
      });
    });
  });
});