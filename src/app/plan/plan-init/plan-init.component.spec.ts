import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanInitComponent } from './plan-init.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlanInitComponent', () => {
  let component: PlanInitComponent;
  let fixture: ComponentFixture<PlanInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanInitComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
