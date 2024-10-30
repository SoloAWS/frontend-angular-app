import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IncidentService } from './incident.service';
import { Document, IncidentCreate, IncidentDetail, IncidentListResponse, User, UserCompanies, UserDetailRequest, Company } from '../models';
import { environment } from '../../environments/environment';

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
    httpMock.verify(); // Verifies that no unmatched HTTP requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getCompaniesByDocument and return UserCompanies', () => {
    const mockDocument: Document = { document_type: 'passport', document_id: '123456' };
    const mockCompanies: Company[] = [{
      id: '1',
      name: 'Company A',
      first_name: 'John',
      last_name: 'Doe',
      birth_date: '1990-01-01',
      phone_number: '1234567890',
      username: 'john.doe@example.com',
      country: 'USA',
      city: 'New York',
      password: 'password'
    }];
    const mockUserCompanies: UserCompanies = { user_id: '1', companies: mockCompanies };

    service.getCompaniesByDocument(mockDocument).subscribe((result) => {
      expect(result).toEqual(mockUserCompanies);
    });

    const req = httpMock.expectOne(`${apiUrl}/user-management/user/companies`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDocument);
    req.flush(mockUserCompanies); // Respond with mock data
  });

  it('should call getUserDetails and return User', () => {
    const mockUserDetailRequest: UserDetailRequest = { user_id: '1', company_id: '1' };
    const mockUser: User = {
      id: '1',
      username: 'johndoe',
      first_name: 'John',
      last_name: 'Doe',
      document_id: '123456',
      document_type: 'passport',
      birth_date: '1990-01-01',
      phone_number: '1234567890',
      importance: 7,
      allow_call: true,
      allow_sms: true,
      allow_email: true,
      registration_date: '2023-01-01',
      incidents: [],
    };

    service.getUserDetails(mockUserDetailRequest).subscribe((result) => {
      expect(result).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/user-management/user/users-view`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUserDetailRequest);
    req.flush(mockUser); // Respond with mock data
  });

  it('should call crearIncident and return success response', () => {
    const mockIncident: IncidentCreate = {
      user_id: '1',
      company_id: '1',
      description: 'Test incident',
      state: 'open',
      channel: 'phone',
      priority: 'high',
    };
    const mockResponse = { success: true };

    service.crearIncident(mockIncident).subscribe((result) => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/incident-management/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockIncident);
    req.flush(mockResponse); // Respond with mock data
  });

  it('should call getAllIncidents and return IncidentListResponse', () => {
    const mockIncidentList: IncidentListResponse = {
      incidents: [
        {
          id: '1',
          description: 'Incident 1',
          state: 'open',
          channel: 'phone',
          priority: 'high',
          creation_date: '2024-10-30T00:10:30.652939Z',
          user_id: 'user1',
          company_id: 'company1',
          company_name: 'Company One',
          manager_id: 'manager1'
        }
      ]
    };

    service.getAllIncidents().subscribe((result) => {
      expect(result).toEqual(mockIncidentList);
    });

    const req = httpMock.expectOne(`${apiUrl}/incident-management/all-incidents`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIncidentList); // Respond with mock data
  });

  it('should call getIncidentById and return IncidentDetail', () => {
    const mockIncidentDetail: IncidentDetail = {
      id: '1',
      description: 'Incident description',
      state: 'open',
      channel: 'phone',
      priority: 'high',
      creation_date: '2024-10-30T00:10:30.652939Z',
      user_id: 'user1',
      user_details: {
        id: 'user1',
        username: 'user1@example.com',
        first_name: 'User',
        last_name: 'One',
        document_id: 'DOC1',
        document_type: 'passport',
        birth_date: '1990-01-01',
        phone_number: '1234567890',
        importance: 5,
        allow_call: true,
        allow_sms: true,
        allow_email: true,
        registration_date: '2024-10-30T00:13:29.659830Z'
      },
      company_id: 'company1',
      company_name: 'Company One',
      manager_id: 'manager1',
      manager_details: {
        id: 'manager1',
        username: 'manager1@example.com',
        first_name: 'Manager',
        last_name: 'One'
      },
      history: [
        { description: 'Incident created', created_at: '2024-10-30T00:10:30.652939Z' }
      ]
    };

    service.getIncidentById('1').subscribe((result) => {
      expect(result).toEqual(mockIncidentDetail);
    });

    const req = httpMock.expectOne(`${apiUrl}/incident-management/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIncidentDetail); // Respond with mock data
  });
});
