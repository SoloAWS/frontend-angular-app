import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockCredentials = { username: 'testuser', password: 'testpassword' };
  const mockResponse = { access_token: 'mock_token' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store the token in localStorage', () => {
    service.login(mockCredentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('access_token')).toEqual(mockResponse.access_token);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  it('should retrieve the token from localStorage', () => {
    localStorage.setItem('access_token', 'mock_token');
    const token = service.getToken();
    expect(token).toBe('mock_token');
  });

  it('should return false if the user is not logged in', () => {
    localStorage.removeItem('access_token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should remove the token from localStorage on logout', () => {
    localStorage.setItem('access_token', 'mock_token');
    service.logout();
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
