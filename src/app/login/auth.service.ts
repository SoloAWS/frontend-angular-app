import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtService } from '../core/services/jwt.service';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private router: Router,
    private jwtService: JwtService) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access_token);
          this.redirectBasedOnRole();
        })
      );
  }

  private redirectBasedOnRole(): void {
    const userType = this.jwtService.getUserType();
    console.log(userType);
    switch (userType) {
      case 'manager':
        console.log('navigating');
        this.router.navigate(['/incident/dashboard-manager']);
        break;
      case 'company':
        this.router.navigate(['/incident/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.jwtService.isTokenExpired();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
