import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailComponent } from './incident-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IncidentService } from '../incident.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('IncidentDetailComponent', () => {
  let component: IncidentDetailComponent;
  let fixture: ComponentFixture<IncidentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        IncidentService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
