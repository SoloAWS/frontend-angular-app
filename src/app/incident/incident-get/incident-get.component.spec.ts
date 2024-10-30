import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentGetComponent } from './incident-get.component';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from '../incident.service';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { IncidentDetail, HistoryItem } from '../../models';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IncidentGetComponent', () => {
  let component: IncidentGetComponent;
  let fixture: ComponentFixture<IncidentGetComponent>;
  let mockIncidentService: jasmine.SpyObj<IncidentService>;

  beforeEach(async () => {
    mockIncidentService = jasmine.createSpyObj('IncidentService', ['getIncidentById']);
    
    const mockIncident: IncidentDetail = {
      id: '1',
      description: 'Sample incident',
      state: 'open',
      channel: 'phone',
      priority: 'high',
      creation_date: '2024-10-30T00:10:30.652939Z',
      user_id: 'user1',
      user_details: {
        id: 'user1',
        username: 'user1@example.com',
        first_name: 'User',
        last_name: 'One',
        document_id: 'DOC1',
        document_type: 'passport',
        birth_date: '1990-01-01',
        phone_number: '1234567890',
        importance: 5,
        allow_call: true,
        allow_sms: true,
        allow_email: true,
        registration_date: '2024-10-30T00:13:29.659830Z'
      },
      company_id: 'company1',
      company_name: 'Company One',
      manager_id: 'manager1',
      manager_details: {
        id: 'manager1',
        username: 'manager1@example.com',
        first_name: 'Manager',
        last_name: 'One'
      },
      history: [
        { description: 'Incident created', created_at: '2024-10-30T00:10:30.652939Z' }
      ]
    };

    await TestBed.configureTestingModule({
      imports: [IncidentGetComponent, MatTableModule, HttpClientTestingModule], // Add IncidentGetComponent to imports instead of declarations
      providers: [
        DatePipe,
        { provide: IncidentService, useValue: mockIncidentService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();

    mockIncidentService.getIncidentById.and.returnValue(of(mockIncident));

    fixture = TestBed.createComponent(IncidentGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize incident data on init', () => {
    expect(component.incident).toBeDefined();
    expect(component.incident?.id).toEqual('1');
    expect(component.latestUpdate).toBeDefined();
    expect(component.elapsedTime).toBeDefined();
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });

  it('should call getIncidentDetail with correct ID', () => {
    expect(mockIncidentService.getIncidentById).toHaveBeenCalledWith('1');
  });

  it('should translate state correctly', () => {
    expect(component.translateState('open')).toEqual('Abierto');
    expect(component.translateState('closed')).toEqual('Resuelto');
    expect(component.translateState('unknown')).toEqual('unknown');
  });

  it('should translate priority correctly', () => {
    expect(component.translatePriority('high')).toEqual('Alta');
    expect(component.translatePriority('medium')).toEqual('Media');
    expect(component.translatePriority('unknown')).toEqual('unknown');
  });

  it('should translate channel correctly', () => {
    expect(component.translateChannel('phone')).toEqual('Llamada');
    expect(component.translateChannel('chat')).toEqual('Chat');
    expect(component.translateChannel('unknown')).toEqual('unknown');
  });

  it('should calculate latest update correctly', () => {
    const datePipe = new DatePipe('en-US');
    const expectedDate = datePipe.transform('2024-10-30T00:10:30.652939Z', 'yyyy-MM-dd HH:mm');
  
    const latestUpdate = component.getLatestUpdate();
    expect(latestUpdate).toBe(expectedDate);
  });
  

  it('should calculate elapsed time correctly', () => {
    const elapsedTime = component.getElapsedTime();
    expect(elapsedTime).toContain('0d');
  });

  it('should render incident details in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    
    expect(compiled.querySelector('h2').textContent).toContain('Incidente 1');
    expect(compiled.querySelector('.detail-item p').textContent).toContain('Empresa: Company One');
    expect(compiled.querySelector('.detail-item h3').textContent).toContain('Detalles del Cliente');
  });
});
