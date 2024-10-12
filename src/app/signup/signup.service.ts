import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from './company';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private apiUrl = "http://localhost:8000";

  constructor(
    private http: HttpClient
  ) { }

  crearCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/company`, company)
  }
}
