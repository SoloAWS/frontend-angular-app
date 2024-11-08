import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IncidentList, DailyStats } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  getPrioritizedIncidents(): Observable<IncidentList[]> {
    return of([
      {
        id: 'ID-004',
        description: 'Interrupción de servicio',
        state: 'En Progreso',
        channel: 'Móvil',
        priority: 'Alta',
        creation_date: '2024-12-09T15:00:00',
        user_id: 'U123',
        company_id: 'C001',
        company_name: 'Cliente VIP',
        manager_id: null,
      },
    ]);
  }

  getAssignedIncidents(): Observable<IncidentList[]> {
    return of([
      {
        id: 'ID-001',
        description: 'Problema de Conexión',
        state: 'En Proceso',
        channel: 'Correo',
        priority: 'Media',
        creation_date: '2024-12-09T15:00:00',
        user_id: 'U124',
        company_id: 'C002',
        company_name: 'Cliente A',
        manager_id: 'M001',
      },
    ]);
  }

  getDailyStats(): Observable<DailyStats> {
    return of({
      incidentsHandled: 15,
      avgResolutionTime: '12 mins',
      customerSatisfaction: 4.5,
    });
  }

  /*  getPrioritizedIncidents(): Observable<IncidentList[]> {
    return this.http.get<IncidentList[]>(
      `${this.apiUrl}/report-generation/user/prioritized-incidents`
    );
  }

  getAssignedIncidents(): Observable<IncidentList[]> {
    return this.http.get<IncidentList[]>(
      `${this.apiUrl}/report-generation/user/assigned-incidents`
    );
  }

  getDailyStats(): Observable<DailyStats> {
    return this.http.get<DailyStats>(`${this.apiUrl}/report-generation/user/daily-stats`);
  } */
}
