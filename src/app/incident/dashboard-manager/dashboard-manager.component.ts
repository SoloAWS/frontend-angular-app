import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { DashboardService } from './dashboard-manager.service';
import { IncidentList, DailyStats } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-manager',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, TranslateModule],
  templateUrl: './dashboard-manager.component.html',
  styleUrls: ['./dashboard-manager.component.css'],
})
export class DashboardManagerComponent implements OnInit {
  prioritizedIncidents: IncidentList[] = [];
  assignedIncidents: IncidentList[] = [];
  dailyStats: DailyStats = {
    incidentsHandled: 0,
    avgResolutionTime: '',
    customerSatisfaction: 0,
  };

  dailyStatsArray: { label: string; value: string | number }[] = [];

  displayedColumns: string[] = [
    'id',
    'description',
    'priority',
    'state',
    'channel',
    'creation_date',
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getPrioritizedIncidents().subscribe((data) => {
      this.prioritizedIncidents = data;
    });

    this.dashboardService.getAssignedIncidents().subscribe((data) => {
      this.assignedIncidents = data;
    });

    this.dashboardService.getDailyStats().subscribe((data) => {
      this.dailyStats = data;
      this.dailyStatsArray = [
        { label: 'Incidentes Atendidos', value: data.incidentsHandled },
        {
          label: 'Tiempo Promedio de Resolución',
          value: data.avgResolutionTime,
        },
        {
          label: 'Satisfacción del Cliente',
          value: `${data.customerSatisfaction}/5`,
        },
      ];
    });
  }

  navigate(): void {
    console.log('navigate...');
  }
}
