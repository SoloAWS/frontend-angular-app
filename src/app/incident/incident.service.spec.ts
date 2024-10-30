// src/app/incident/incident.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IncidentService } from './incident.service';
import { environment } from '../../environments/environment';
import { mockDocument, mockIncidentDetail, mockUser, mockUserCompanies, mockUserDetailRequest } from './test-helpers';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IncidentService],
    });
    service = TestBed.inject(IncidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getCompaniesByDocument and return UserCompanies', () => {
    service.getCompaniesByDocument(mockDocument).subscribe((result) => {
      expect(result).toEqual(mockUserCompanies);
    });

    const req = httpMock.expectOne(`${apiUrl}/user-management/user/companies`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDocument);
    req.flush(mockUserCompanies);
  });

  it('should call getUserDetails and return User', () => {
    service.getUserDetails(mockUserDetailRequest).subscribe((result) => {
      expect(result).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/user-management/user/users-view`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUserDetailRequest);
    req.flush(mockUser);
  });

  it('should call getIncidentById and return IncidentDetail', () => {
    service.getIncidentById('1').subscribe((result) => {
      expect(result).toEqual(mockIncidentDetail);
    });

    const req = httpMock.expectOne(`${apiUrl}/incident-management/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIncidentDetail);
  });
});
