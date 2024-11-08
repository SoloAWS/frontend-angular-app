import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IncidentList, DailyStats } from '../../models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPrioritizedIncidents(): Observable<IncidentList[]> {
    return this.http.get<IncidentList[]>(
      `${this.apiUrl}/incident-management/manager/high-priority-assigned-incidents`
    );
  }

  getAssignedIncidents(): Observable<IncidentList[]> {
    return this.http.get<IncidentList[]>(
      `${this.apiUrl}/incident-management/manager/assigned-incidents`
    );
  }

  getDailyStats(): Observable<DailyStats> {
    return this.http.get<DailyStats>(
      `${this.apiUrl}/incident-management/manager/daily-stats`
    );
  }
}
