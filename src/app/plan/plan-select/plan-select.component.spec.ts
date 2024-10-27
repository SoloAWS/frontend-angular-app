import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSelectComponent } from './plan-select.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PlanSelectComponent', () => {
  let component: PlanSelectComponent;
  let fixture: ComponentFixture<PlanSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanSelectComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
