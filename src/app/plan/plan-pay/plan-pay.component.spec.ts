import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPayComponent } from './plan-pay.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PlanPayComponent', () => {
  let component: PlanPayComponent;
  let fixture: ComponentFixture<PlanPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanPayComponent, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
