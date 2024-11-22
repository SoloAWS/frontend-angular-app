import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtService);
  });

  afterEach(() => {
    localStorage.clear(); // Clear localStorage after each test
  });

  it('should decode a valid JWT token', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJhZG1pbiIsImV4cCI6MTkzNzU4MDAwMH0.4WyOiEug1HH4KrN7NupEshPEY0ef7XIlG9SpHNd-EH4';
    const decoded = service.decodeToken(validToken);

    expect(decoded).toEqual({
      user_type: 'admin',
      exp: 1937580000
    });
  });

  it('should return null for an invalid JWT token', () => {
    const invalidToken = 'invalid.token.string';
    const decoded = service.decodeToken(invalidToken);

    expect(decoded).toBeNull();
  });

  it('should return the user type from the token', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJ1c2VyIiwiZXhwIjoxOTM3NTgwMDAwfQ.4WyOiEug1HH4KrN7NupEshPEY0ef7XIlG9SpHNd-EH4';
    localStorage.setItem('access_token', token);

    const userType = service.getUserType();

    expect(userType).toBe('user');
  });

  it('should return null if there is no token in localStorage', () => {
    const userType = service.getUserType();

    expect(userType).toBeNull();
  });

  it('should return true if the token is expired', () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJ1c2VyIiwiZXhwIjoxNjcwMDAwMDAwfQ.4WyOiEug1HH4KrN7NupEshPEY0ef7XIlG9SpHNd-EH4';
    localStorage.setItem('access_token', expiredToken);

    const isExpired = service.isTokenExpired();

    expect(isExpired).toBeTrue();
  });

  it('should return false if the token is not expired', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJ1c2VyIiwiZXhwIjoxOTM3NTgwMDAwfQ.4WyOiEug1HH4KrN7NupEshPEY0ef7XIlG9SpHNd-EH4';
    localStorage.setItem('access_token', validToken);

    const isExpired = service.isTokenExpired();

    expect(isExpired).toBeFalse();
  });

  it('should return true if there is no token in localStorage when checking expiration', () => {
    const isExpired = service.isTokenExpired();

    expect(isExpired).toBeTrue();
  });
});
