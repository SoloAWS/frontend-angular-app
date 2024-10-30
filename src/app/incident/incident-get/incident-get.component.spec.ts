// src/app/incident/incident-get.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentGetComponent } from './incident-get.component';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from '../incident.service';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockIncidentDetail } from '../test-helpers';

describe('IncidentGetComponent', () => {
  let component: IncidentGetComponent;
  let fixture: ComponentFixture<IncidentGetComponent>;
  let mockIncidentService: jasmine.SpyObj<IncidentService>;

  beforeEach(async () => {
    mockIncidentService = jasmine.createSpyObj('IncidentService', ['getIncidentById']);
    await TestBed.configureTestingModule({
      imports: [IncidentGetComponent, MatTableModule, HttpClientTestingModule],
      providers: [
        DatePipe,
        { provide: IncidentService, useValue: mockIncidentService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    mockIncidentService.getIncidentById.and.returnValue(of(mockIncidentDetail));

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
});
