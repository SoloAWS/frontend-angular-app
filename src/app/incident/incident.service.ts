import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document, User, UserCompanies, UserDetailRequest } from '../models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCompaniesByDocument(userDocument: Document): Observable<UserCompanies> {
    return this.http.post<UserCompanies>(
      `${this.apiUrl}/user-management/user/companies`,
      userDocument
    );
  }

  getUserDetails(userDetailRequest: UserDetailRequest): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/user-management/user/users-view`,
      userDetailRequest
    );
  }
}
