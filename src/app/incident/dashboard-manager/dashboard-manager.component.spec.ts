import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardManagerComponent } from './dashboard-manager.component';
import { DashboardService } from './dashboard-manager.service';
import { of } from 'rxjs';
import { IncidentList, DailyStats } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

describe('DashboardManagerComponent', () => {
  let component: DashboardManagerComponent;
  let fixture: ComponentFixture<DashboardManagerComponent>;
  let dashboardService: DashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardManagerComponent, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [DashboardService]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardManagerComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load prioritized incidents on init', () => {
    const mockPrioritizedIncidents: IncidentList[] = [
      {
        id: '1',
        description: 'Test Incident 1',
        state: 'open',
        channel: 'email',
        priority: 'high',
        creation_date: '2024-11-08',
        user_id: '1',
        company_id: '1',
        company_name: 'Company A',
        manager_id: null
      },
    ];

    spyOn(dashboardService, 'getPrioritizedIncidents').and.returnValue(of(mockPrioritizedIncidents));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.prioritizedIncidents).toEqual(mockPrioritizedIncidents);
  });

  it('should load assigned incidents on init', () => {
    const mockAssignedIncidents: IncidentList[] = [
      {
        id: '2',
        description: 'Test Incident 2',
        state: 'closed',
        channel: 'phone',
        priority: 'medium',
        creation_date: '2024-11-08',
        user_id: '2',
        company_id: '2',
        company_name: 'Company B',
        manager_id: '2'
      },
    ];

    spyOn(dashboardService, 'getAssignedIncidents').and.returnValue(of(mockAssignedIncidents));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.assignedIncidents).toEqual(mockAssignedIncidents);
  });

  it('should load daily stats on init', () => {
    const mockDailyStats: DailyStats = {
      incidentsHandled: 5,
      avgResolutionTime: '30 min',
      customerSatisfaction: 4.5
    };

    spyOn(dashboardService, 'getDailyStats').and.returnValue(of(mockDailyStats));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.dailyStats).toEqual(mockDailyStats);
    expect(component.dailyStatsArray).toEqual([
      { label: 'Incidentes Atendidos', value: 5 },
      { label: 'Tiempo Promedio de Resolución', value: '30 min' },
      { label: 'Satisfacción del Cliente', value: '4.5/5' }
    ]);
  });

  it('should call navigate method', () => {
    spyOn(component, 'navigate');
    component.navigate();
    expect(component.navigate).toHaveBeenCalled();
  });
});
