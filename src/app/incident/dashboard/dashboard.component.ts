import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
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

  constructor(private dashboardService: DashboardService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Seleccionar el canvas del DOM
    const barCanvas = this.el.nativeElement.querySelector('canvas');
    if (barCanvas) {
      this.renderer.setAttribute(
        barCanvas,
        'aria-label',
        'Gráfico de barras que muestra el volumen de llamadas por hora.'
      );
      this.renderer.setAttribute(
        barCanvas,
        'role',
        'img'
      );
    }

    const pieCanvas = this.el.nativeElement.querySelectorAll('canvas')[1];
    if (pieCanvas) {
      this.renderer.setAttribute(
        pieCanvas,
        'aria-label',
        'Gráfico de pastel que muestra la tendencia de satisfacción del cliente.'
      );
      this.renderer.setAttribute(
        pieCanvas,
        'role',
        'img'
      );
    }
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
