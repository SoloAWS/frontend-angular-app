import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../login/auth.service';
import { JwtService } from '../services/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const jwtService = inject(JwtService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (jwtService.isTokenExpired()) {
    authService.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as string[];
  const userType = jwtService.getUserType();

  if (!userType || !allowedRoles.includes(userType)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
