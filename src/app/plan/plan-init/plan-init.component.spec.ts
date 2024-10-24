import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanInitComponent } from './plan-init.component';

describe('PlanInitComponent', () => {
  let component: PlanInitComponent;
  let fixture: ComponentFixture<PlanInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanInitComponent]
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
