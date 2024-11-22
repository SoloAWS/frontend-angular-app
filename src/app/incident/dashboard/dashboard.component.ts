import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from './dashboard.service';
import {
  CallVolumeData,
  CustomerSatisfactionData,
  IncidentList,
} from '../../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, ChartModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalCalls: number = 0;
  averageHandlingTime: string = '';
  customerSatisfactionPercentage: number = 0;
  openTickets: number = 0;

  callVolumeData: CallVolumeData = {
    labels: [],
    datasets: [
      {
        label: 'Llamadas',
        data: [],
        backgroundColor: '#4CAF50',
      },
    ],
  };

  customerSatisfactionData: CustomerSatisfactionData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  recentIncidents: IncidentList[] = [];

  barOptions = {
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.totalCalls = data.stats.totalCalls;
        this.averageHandlingTime = data.stats.averageHandlingTime;
        this.customerSatisfactionPercentage = data.stats.customerSatisfaction;
        this.openTickets = data.stats.openTickets;
        this.callVolumeData = data.callVolume;
        this.customerSatisfactionData = data.customerSatisfaction;
        this.recentIncidents = data.recentIncidents;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        // Here you might want to show an error message to the user
      },
    });
  }
}
