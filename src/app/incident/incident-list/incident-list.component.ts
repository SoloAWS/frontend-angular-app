import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../incident.service';
import { IncidentList, IncidentListResponse } from '../../models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
     MatInputModule,
      MatTableModule
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
        this.incidents = incidentsResponse.incidents;
        this.dataSource.data = incidentsResponse.incidents;
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
}