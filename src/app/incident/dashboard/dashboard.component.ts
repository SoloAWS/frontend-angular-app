import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ChartModule } from 'primeng/chart';

interface RecentIncident {
  id: string;
  client: string;
  description: string;
  status: string;
  channel: string;
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  displayedColumns: string[] = [
    'id',
    'client',
    'description',
    'status',
    'channel',
    'date',
  ];

  recentIncidents: RecentIncident[] = [
    {
      id: 'ID-001',
      client: 'Cliente A',
      description: 'Problema de Conexión',
      status: 'En Proceso',
      channel: 'Llamada',
      date: '12/09/2024 15:00',
    },
    {
      id: 'ID-002',
      client: 'Cliente B',
      description: 'Facturación Incorrecta',
      status: 'Resuelto',
      channel: 'Móvil',
      date: '12/09/2024 11:00',
    },
  ];

  callVolumeData = {
    labels: ['00:00', '03:00', '06:00', '9:00', '12:00', '15:00', '18:00'],
    datasets: [
      {
        label: 'Llamadas',
        data: [15, 25, 55, 85, 15, 25, 55],
        backgroundColor: '#4CAF50',
      },
    ],
  };

  customerSatisfactionData = {
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
  };

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
}
