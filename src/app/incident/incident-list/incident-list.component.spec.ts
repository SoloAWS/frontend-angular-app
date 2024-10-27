import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentListComponent } from './incident-list.component';
import { IncidentService } from '../incident.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IncidentListResponse, IncidentList } from '../../models';
import { MatTableDataSource } from '@angular/material/table';
import { By } from '@angular/platform-browser';

describe('IncidentListComponent', () => {
  let component: IncidentListComponent;
  let fixture: ComponentFixture<IncidentListComponent>;
  let incidentService: jasmine.SpyObj<IncidentService>;

  const mockIncidents: IncidentList[] = [
    {
      id: '1',
      description: 'Sample incident 1',
      state: 'open',
      channel: 'phone',
      priority: 'high',
      creation_date: '2024-10-25T23:05:16.520715Z',
      user_id: 'user1',
      company_id: 'company1',
      company_name: 'Company One',
      manager_id: null
    },
    {
      id: '2',
      description: 'Sample incident 2',
      state: 'closed',
      channel: 'email',
      priority: 'low',
      creation_date: '2024-10-25T15:05:16.520715Z',
      user_id: 'user2',
      company_id: 'company2',
      company_name: 'Company Two',
      manager_id: null
    }
  ];

  beforeEach(async () => {
    const incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['getAllIncidents']);

    await TestBed.configureTestingModule({
      imports: [
        IncidentListComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: IncidentService, useValue: incidentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentListComponent);
    component = fixture.componentInstance;
    incidentService = TestBed.inject(IncidentService) as jasmine.SpyObj<IncidentService>;

    // Mock the getAllIncidents method to return an observable with mock data
    const incidentResponse: IncidentListResponse = { incidents: mockIncidents };
    incidentService.getAllIncidents.and.returnValue(of(incidentResponse));

    fixture.detectChanges(); // Trigger initial data binding and ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch incidents on initialization', () => {
    expect(incidentService.getAllIncidents).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockIncidents.map(incident => ({
      ...incident,
      state: component.translateState(incident.state),
      channel: component.translateChannel(incident.channel)
    })));
  });

  it('should handle error when fetching incidents fails', () => {
    // Mock an error response
    incidentService.getAllIncidents.and.returnValue(throwError('Error'));
  
    spyOn(console, 'error');
  
    // Clear the data manually before retrying ngOnInit
    component.dataSource.data = []; 
    component.ngOnInit(); // Re-initialize to trigger error
  
    expect(console.error).toHaveBeenCalledWith('Error fetching incidents:', 'Error');
    expect(component.dataSource.data).toEqual([]);
  });
  
  it('should filter incidents based on search input', () => {
    component.dataSource = new MatTableDataSource(mockIncidents);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'incident 1';
    inputElement.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();

    expect(component.dataSource.filter).toBe('incident 1');
  });

  it('should clear filter input and apply empty filter when clear button is clicked', () => {
    component.dataSource = new MatTableDataSource(mockIncidents);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'sample';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('button')).nativeElement;
    clearButton.click();
    fixture.detectChanges();

    expect(inputElement.value).toBe('');
    expect(component.dataSource.filter).toBe('');
  });

  it('should translate state correctly', () => {
    expect(component.translateState('open')).toBe('Abierto');
    expect(component.translateState('closed')).toBe('Resuelto');
    expect(component.translateState('in_progress')).toBe('En progreso');
    expect(component.translateState('escalated')).toBe('Escalado');
    expect(component.translateState('unknown')).toBe('unknown');
  });

  it('should translate channel correctly', () => {
    expect(component.translateChannel('phone')).toBe('Llamada');
    expect(component.translateChannel('mobile')).toBe('Móvil');
    expect(component.translateChannel('chat')).toBe('Chat');
    expect(component.translateChannel('email')).toBe('Correo');
    expect(component.translateChannel('unknown')).toBe('unknown');
  });
});
