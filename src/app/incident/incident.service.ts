import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document, Incident, User, UserCompanies, UserDetailRequest } from '../models';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

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

  getUserDetails(userDetailRequest: UserDetailRequest): Observable<User> {
    /*return this.http.post<User>(
      `${this.apiUrl}/user-management/user/users-view`,
      userDetailRequest
    );*/
    const incident1 = new Incident(
      "9d145ac8-ead2-4b4e-94ef-d09d9f3ec672",
      "Sample incident description",
      "open",
      "2024-10-19T01:30:42.780111Z"
    );

    const incident2 = new Incident(
      "612629d3-e4aa-4472-ac47-3d9b6789721b",
      "Sample incident description",
      "open",
      "2024-10-19T01:30:41.821418Z"
    );

    const incident3 = new Incident(
      "5aa35673-1871-4251-898b-0f710cb97ee9",
      "Sample incident description",
      "open",
      "2024-10-19T01:30:39.458021Z"
    );

    const user = new User(
      "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      "user1@example.com",
      "User",
      "One",
      "PASS1",
      "passport",
      "1990-01-01",
      "1111111111",
      5,
      true,
      true,
      true,
      "2024-10-19T00:35:05.556522Z",
      [incident1, incident2, incident3]
    );
    return of(user);
  }
}
