import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../incident.service';
import { IncidentList, IncidentListResponse } from '../../models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.css'
})
export class IncidentListComponent implements OnInit {
  incidents: IncidentList[] | null = null;
  displayedColumns: string[] = ['id', 'company_name', 'description', 'state', 'channel', 'creation_date'];
  dataSource = new MatTableDataSource<IncidentList>();

  constructor(
    private incidentService: IncidentService,
  ) { }

  ngOnInit(): void {
    this.getAllIncidents();
  }

  getAllIncidents(): void {
    this.incidentService.getAllIncidents().subscribe(
      (incidentsResponse: IncidentListResponse) => {
        this.incidents = incidentsResponse.incidents.map(incident => ({
          ...incident,
          state: this.translateState(incident.state),
          channel: this.translateChannel(incident.channel)
        }));
        this.dataSource.data = this.incidents;
      },
      (error) => {
        console.error('Error fetching incidents:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter(input: HTMLInputElement) {
    input.value = '';
    this.applyFilter({ target: input } as unknown as Event);
  }

  translateState(state: string): string {
    const stateTranslations: { [key: string]: string } = {
      open: 'Abierto',
      closed: 'Resuelto',
      in_progress: 'En progreso',
      escalated: 'Escalado'
    };
    return stateTranslations[state] || state;
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
}