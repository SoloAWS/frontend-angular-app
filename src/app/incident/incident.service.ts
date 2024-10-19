import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document, UserCompanies } from '../models';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompaniesByDocument(userDocument: Document): Observable<UserCompanies> {
    /*return this.http.post<UserCompanies>(
      `${this.apiUrl}/user-management/user/companies`,
      userDocument
    );*/
    const mockResponse: UserCompanies = {
      user_id: "339ae864-c06c-4888-a5c8-2e3f5fc7189f",
      companies: [
        {
          id: "bb898a18-d424-4177-a169-e83ca74462eb",
          name: "TechInnovate Solutions",
          first_name: "John",
          last_name: "Doe",
          birth_date: "1985-05-15",
          phone_number: "+01 234 567 8901",
          country: "United States",
          city: "San Francisco",
          username: "2024-10-11T21:07:32.481-05:00",
          password: "321321"
        },
        {
          id: "53898518-beb1-4b0a-9f9a-eddaa0e08fb5",
          name: "Hola hola",
          first_name: "Jane",
          last_name: "Doe",
          birth_date: "1985-05-15",
          phone_number: "+01 234 567 8902",
          country: "United States",
          city: "San Francisco",
          username: "2024-10-11T21:07:32.481-05:00",
          password: "321321"
        },
        {
          id: "ab83f5d7-c694-4339-8699-639b4dcf94cf",
          name: "asdasdasda",
          first_name: "Jake",
          last_name: "Doe",
          birth_date: "1985-05-15",
          phone_number: "+01 234 567 8903",
          country: "United States",
          city: "San Francisco",
          username: "2024-10-11T21:07:32.481-05:00",
          password: "321321"
        }
      ]
    };
    return of(mockResponse);
  }
}
