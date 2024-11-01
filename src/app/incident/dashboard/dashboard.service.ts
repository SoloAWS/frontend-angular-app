import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardData,
  DashboardStats,
  CallVolumeData,
  CustomerSatisfactionData,
  IncidentListResponse,
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
        recentIncidents: response.incidents.incidents,
      }))
    );
  }

  private getDashboardStats(): Observable<DashboardStats> {
    // Return mock data
    return of({
      totalCalls: 1234,
      averageHandlingTime: '5:30',
      customerSatisfaction: 92,
      openTickets: 45,
    });

    // Real API call (commented)
    // return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  private getCallVolumeData(): Observable<CallVolumeData> {
    // Return mock data
    return of({
      labels: [
        '00:00',
        '03:00',
        '06:00',
        '09:00',
        '12:00',
        '15:00',
        '18:00',
        '21:00',
      ],
      datasets: [
        {
          label: 'Llamadas',
          data: [25, 45, 75, 95, 85, 65, 45, 30],
          backgroundColor: '#4CAF50',
        },
      ],
    });

    // Real API call (commented)
    // return this.http.get<CallVolumeData>(`${this.apiUrl}/dashboard/call-volume`);
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
          backgroundColor: ['#9C27B0', '#2196F3', '#00BCD4', '#9C27B0'],
        },
      ],
    });

    // Real API call (commented)
    // return this.http.get<CustomerSatisfactionData>(`${this.apiUrl}/dashboard/satisfaction`);
  }

  private getRecentIncidents(): Observable<IncidentListResponse> {
    // Return mock data
    return of({
      incidents: [
        {
          id: 'INC-001',
          description: 'Falla en el servicio de internet',
          state: 'En Proceso',
          channel: 'Teléfono',
          priority: 'Alta',
          creation_date: new Date(2024, 10, 1, 14, 30).toISOString(),
          user_id: 'USR-001',
          company_id: 'CMP-001',
          company_name: 'Empresa A',
          manager_id: 'MGR-001',
        },
        {
          id: 'INC-002',
          description: 'Problema de facturación',
          state: 'Resuelto',
          channel: 'Email',
          priority: 'Media',
          creation_date: new Date(2024, 10, 1, 13, 15).toISOString(),
          user_id: 'USR-002',
          company_id: 'CMP-001',
          company_name: 'Empresa B',
          manager_id: 'MGR-002',
        },
        {
          id: 'INC-003',
          description: 'Actualización de plan',
          state: 'Pendiente',
          channel: 'Chat',
          priority: 'Baja',
          creation_date: new Date(2024, 10, 1, 12, 45).toISOString(),
          user_id: 'USR-003',
          company_id: 'CMP-002',
          company_name: 'Empresa C',
          manager_id: null,
        },
        {
          id: 'INC-004',
          description: 'Falla en equipamiento',
          state: 'En Proceso',
          channel: 'Teléfono',
          priority: 'Alta',
          creation_date: new Date(2024, 10, 1, 11, 20).toISOString(),
          user_id: 'USR-004',
          company_id: 'CMP-002',
          company_name: 'Empresa D',
          manager_id: 'MGR-003',
        },
        {
          id: 'INC-005',
          description: 'Cambio de dirección',
          state: 'Resuelto',
          channel: 'Portal Web',
          priority: 'Baja',
          creation_date: new Date(2024, 10, 1, 10, 0).toISOString(),
          user_id: 'USR-005',
          company_id: 'CMP-003',
          company_name: 'Empresa E',
          manager_id: 'MGR-001',
        },
      ],
    });

    // Real API call (commented)
    // return this.http.get<IncidentListResponse>(`${this.apiUrl}/incident-management/all-incidents`);
  }
}
