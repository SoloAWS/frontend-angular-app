// src/app/tests/test-helpers.ts
import { IncidentDetail, User, Document, Company, UserCompanies, UserDetailRequest } from '../models';

export const mockIncidentDetail: IncidentDetail = {
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

export const mockUser: User = {
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
  incidents: []
};

export const mockDocument: Document = { document_type: 'passport', document_id: '123456' };

export const mockCompany: Company = {
  id: '1',
  name: 'Company A',
  first_name: 'John',
  last_name: 'Doe',
  birth_date: '1990-01-01',
  phone_number: '1234567890',
  username: 'john.doe@example.com',
  country: 'USA',
  city: 'New York',
  password: 'pass_placeholder'
};

export const mockUserCompanies: UserCompanies = { user_id: '1', companies: [mockCompany] };

export const mockUserDetailRequest: UserDetailRequest = { user_id: '1', company_id: '1' };
