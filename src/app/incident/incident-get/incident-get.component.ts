import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from '../incident.service';
import { HistoryItem, IncidentDetail } from '../../models';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-incident-get',
  standalone: true,
  imports: [DatePipe, MatTableModule],
  providers: [DatePipe],
  templateUrl: './incident-get.component.html',
  styleUrl: './incident-get.component.css'
})
export class IncidentGetComponent implements OnInit {
  incident: IncidentDetail | null = null;
  latestUpdate: string | null = null;
  elapsedTime: string | null = null;
  displayedColumns: string[] = ['created_at', 'description'];
  dataSource = new MatTableDataSource<HistoryItem>();

  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getIncidentDetail(id);
    }
  }

  getIncidentDetail(id: string): void {
    this.incidentService.getIncidentById(id).subscribe(
      (incident: IncidentDetail) => {
        this.incident = incident;
        this.latestUpdate = this.getLatestUpdate();
        this.elapsedTime = this.getElapsedTime();
        this.dataSource.data = this.incident.history;
      },
      (error) => {
        console.error('Error fetching incident details:', error);
      }
    );
  }

  translateState(state: string): string {
    const stateTranslations: { [key: string]: string } = {
      'open': 'Abierto',
      'closed': 'Resuelto',
      'in_progress': 'En progreso',
      'escalated': 'Escalado'
    };

    return stateTranslations[state] || state;
  }

  translatePriority(priority: string): string {
    const stateTranslations: { [key: string]: string } = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta'
    };

    return stateTranslations[priority] || priority;
  }

  translateChannel(channel: string): string {
    const channelTranslations: { [key: string]: string } = {
      phone: 'Llamada',
      mobile: 'Móvil',
      chat: 'Chat',
      email: 'Correo'
    };
    return channelTranslations[channel] || channel;
  }

  getLatestUpdate(): string | null {
    if (!this.incident?.history?.length) return null;

    const latestHistory = this.incident.history.reduce((latest, current) =>
      new Date(current.created_at) > new Date(latest.created_at) ? current : latest,
      this.incident.history[0] // Initial value as the first element
    );

    return this.datePipe.transform(latestHistory.created_at, 'yyyy-MM-dd HH:mm');
  }

  getElapsedTime(): string | null {
    if (!this.incident?.history?.length) return null;

    const oldestHistory = this.incident.history.reduce((oldest, current) =>
      new Date(current.created_at) < new Date(oldest.created_at) ? current : oldest,
      this.incident.history[0] // Initial value as the first element
    );

    const oldestDate = new Date(oldestHistory.created_at);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - oldestDate.getTime();

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  }
}
