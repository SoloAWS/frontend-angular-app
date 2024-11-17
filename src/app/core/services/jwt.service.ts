import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user_type: string;
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  getUserType(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.user_type || null;
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }
}
