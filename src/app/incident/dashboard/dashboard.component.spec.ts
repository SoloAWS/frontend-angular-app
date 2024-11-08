import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [DashboardService],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize default values', () => {
    expect(component.totalCalls).toBe(0);
    expect(component.averageHandlingTime).toBe('');
    expect(component.customerSatisfactionPercentage).toBe(0);
    expect(component.openTickets).toBe(0);
    expect(component.callVolumeData.labels).toEqual([]);
    expect(component.customerSatisfactionData.labels).toEqual([]);
    expect(component.recentIncidents).toEqual([]);
  });

  it('should load dashboard data on init', () => {
    const mockData = {
      stats: {
        totalCalls: 100,
        averageHandlingTime: '5m 30s',
        customerSatisfaction: 95,
        openTickets: 10,
      },
      callVolume: {
        labels: ['9 AM', '10 AM'],
        datasets: [{ label: 'Llamadas', data: [50, 50], backgroundColor: '#4CAF50' }],
      },
      customerSatisfaction: {
        labels: ['Satisfied', 'Neutral', 'Dissatisfied'],
        datasets: [{ data: [70, 20, 10], backgroundColor: ['#4CAF50', '#FFC107', '#F44336'] }],
      },
      recentIncidents: [
        {
          id: '1',
          description: 'Network Issue',
          state: 'Open',
          channel: 'Email',
          creation_date: '2024-11-06T10:00:00',
          priority: 'High',
          user_id: 'user123',
          company_id: 'company123',
          company_name: 'TechCorp',
          manager_id: 'manager123',
        },
      ],
    };

    spyOn(dashboardService, 'getDashboardData').and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.totalCalls).toBe(100);
    expect(component.averageHandlingTime).toBe('5m 30s');
    expect(component.customerSatisfactionPercentage).toBe(95);
    expect(component.openTickets).toBe(10);
    expect(component.callVolumeData.labels).toEqual(['9 AM', '10 AM']);
    expect(component.recentIncidents.length).toBe(1);
    expect(component.recentIncidents[0].description).toBe('Network Issue');
  });

  it('should handle error when loading dashboard data fails', () => {
    spyOn(dashboardService, 'getDashboardData').and.returnValue(throwError(() => new Error('Service error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading dashboard data:', jasmine.any(Error));
  });

  it('should render stats in the template', () => {
    component.totalCalls = 100;
    component.averageHandlingTime = '5m 30s';
    component.customerSatisfactionPercentage = 95;
    component.openTickets = 10;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.stats-container mat-card:nth-child(1) .stat-value')?.textContent).toContain('100');
    expect(compiled.querySelector('.stats-container mat-card:nth-child(2) .stat-value')?.textContent).toContain('5m 30s');
    expect(compiled.querySelector('.stats-container mat-card:nth-child(3) .stat-value')?.textContent).toContain('95%');
    expect(compiled.querySelector('.stats-container mat-card:nth-child(4) .stat-value')?.textContent).toContain('10');
  });
  
});
