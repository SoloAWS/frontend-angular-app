import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCreateComponent } from './incident-create.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IncidentService } from '../incident.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('IncidentCreateComponent', () => {
  let component: IncidentCreateComponent;
  let fixture: ComponentFixture<IncidentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentCreateComponent, RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        IncidentService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
