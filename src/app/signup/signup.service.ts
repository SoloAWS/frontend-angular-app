import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from './company';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crearCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(
      `${this.apiUrl}/user-management/company/`,
      company
    );
  }
}
