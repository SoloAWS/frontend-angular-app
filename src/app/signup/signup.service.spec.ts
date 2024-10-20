import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SignupService } from './signup.service';
import { environment } from '../../environments/environment';
import { Company } from '../models';
import { RouterTestingModule } from '@angular/router/testing';

describe('SignupService', () => {
  let service: SignupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SignupService],
    });
    service = TestBed.inject(SignupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a company', () => {
    const mockCompany: Company = new Company(
      '1',
      'Test Company',
      'John',
      'Doe',
      '1990-01-01',
      '1234567890',
      'johndoe',
      'USA',
      'New York',
      'password123'
    );

    service.crearCompany(mockCompany).subscribe((company) => {
      expect(company).toEqual(mockCompany);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/user-management/company/`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockCompany);
  });

  it('should use the correct API URL', () => {
    const mockCompany: Company = new Company(
      '1',
      'Test Company',
      'John',
      'Doe',
      '1990-01-01',
      '1234567890',
      'johndoe',
      'USA',
      'New York',
      'password123'
    );

    service.crearCompany(mockCompany).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/user-management/company/`
    );
    expect(req.request.url).toBe(
      `${environment.apiUrl}/user-management/company/`
    );
    req.flush(mockCompany);
  });

  it('should send the company data in the request body', () => {
    const mockCompany: Company = new Company(
      '1',
      'Test Company',
      'John',
      'Doe',
      '1990-01-01',
      '1234567890',
      'johndoe',
      'USA',
      'New York',
      'password123'
    );

    service.crearCompany(mockCompany).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/user-management/company/`
    );
    expect(req.request.body).toEqual(mockCompany);
    req.flush(mockCompany);
  });

  it('should handle company creation with all fields', () => {
    const mockCompany: Company = new Company(
      '1',
      'Test Company',
      'John',
      'Doe',
      '1990-01-01',
      '1234567890',
      'johndoe',
      'USA',
      'New York',
      'password123'
    );

    service.crearCompany(mockCompany).subscribe((company) => {
      expect(company.id).toBe('1');
      expect(company.name).toBe('Test Company');
      expect(company.first_name).toBe('John');
      expect(company.last_name).toBe('Doe');
      expect(company.birth_date).toBe('1990-01-01');
      expect(company.phone_number).toBe('1234567890');
      expect(company.username).toBe('johndoe');
      expect(company.country).toBe('USA');
      expect(company.city).toBe('New York');
      expect(company.password).toBe('password123');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/user-management/company/`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockCompany);
  });

  it('should handle error response', () => {
    const mockCompany: Company = new Company(
      '1',
      'Test Company',
      'John',
      'Doe',
      '1990-01-01',
      '1234567890',
      'johndoe',
      'USA',
      'New York',
      'password123'
    );
    const mockError = { status: 400, statusText: 'Bad Request' };

    service.crearCompany(mockCompany).subscribe(
      () => fail('should have failed with the 400 error'),
      (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    );

    const req = httpMock.expectOne(
      `${environment.apiUrl}/user-management/company/`
    );
    expect(req.request.method).toBe('POST');
    req.flush('Invalid data', mockError);
  });
});
