import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardData,
  DashboardStats,
  CallVolumeData,
  CustomerSatisfactionData,
  IncidentDetail,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return forkJoin({
      stats: this.getDashboardStats(),
      callVolume: this.getCallVolumeData(),
      customerSatisfaction: this.getCustomerSatisfactionData(),
      incidents: this.getRecentIncidents(),
    }).pipe(
      map((response) => ({
        stats: response.stats,
        callVolume: response.callVolume,
        customerSatisfaction: response.customerSatisfaction,
        recentIncidents: response.incidents,
      }))
    );
  }

  private getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/report-generation/dashboard/stats`
    );
  }

  private getCallVolumeData(): Observable<CallVolumeData> {
    return this.http.get<CallVolumeData>(
      `${this.apiUrl}/report-generation/dashboard/call-volume`
    );
  }

  private getCustomerSatisfactionData(): Observable<CustomerSatisfactionData> {
    // Return mock data
    return of({
      labels: [
        'Satisfecho',
        'Moderadamente satisfecho',
        'Indiferente',
        'Insatisfecho',
      ],
      datasets: [
        {
          data: [40, 30, 20, 10],
          backgroundColor: ['#B239B2', '#3E97DE', '#26A69A', '#673AB7'],
        },
      ],
    });

    // Real API call (commented)
    // return this.http.get<CustomerSatisfactionData>(`${this.apiUrl}/dashboard/satisfaction`);
  }

  private getRecentIncidents(): Observable<IncidentDetail[]> {
    return this.http.get<IncidentDetail[]>(
      `${this.apiUrl}/report-generation/dashboard/recent-incidents`
    );
  }
}
