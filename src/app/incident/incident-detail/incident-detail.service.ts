import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IncidentDetailService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generateResponse(prompt: string): Observable<any> {
    const body = { prompt: prompt };
    return this.http.post<any>(`${this.apiUrl}/generative-ai/generate`, body);
  }
}
