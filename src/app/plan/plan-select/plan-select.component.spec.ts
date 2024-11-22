import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlanSelectComponent } from './plan-select.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanService } from '../plan.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FormDataService } from '../../form-data.service';
import { Plan, PlanList } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

describe('PlanSelectComponent', () => {
  let component: PlanSelectComponent;
  let fixture: ComponentFixture<PlanSelectComponent>;
  let planService: jasmine.SpyObj<PlanService>;
  let router: Router;
  let formDataService: jasmine.SpyObj<FormDataService>;

  const mockPlans = new PlanList([
    new Plan('1', 'Basic Plan', 29.99, [{ description: 'Feature 1' }, { description: 'Feature 2' }], 'USD'),
    new Plan('2', 'Premium Plan', 49.99, [{ description: 'Feature A' }, { description: 'Feature B' }], 'USD')
  ]);

  beforeEach(async () => {
    const planServiceSpy = jasmine.createSpyObj('PlanService', ['getPlans']);
    const formDataServiceSpy = jasmine.createSpyObj('FormDataService', ['setFormData']);

    await TestBed.configureTestingModule({
      imports: [PlanSelectComponent, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: PlanService, useValue: planServiceSpy },
        { provide: FormDataService, useValue: formDataServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) } // Mock Router
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanSelectComponent);
    component = fixture.componentInstance;
    planService = TestBed.inject(PlanService) as jasmine.SpyObj<PlanService>;
    router = TestBed.inject(Router);
    formDataService = TestBed.inject(FormDataService) as jasmine.SpyObj<FormDataService>;

    // Setup default behavior for planService.getPlans to return mock data
    planService.getPlans.and.returnValue(of(mockPlans));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch plans on initialization', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.plans).toEqual(mockPlans);
    expect(planService.getPlans).toHaveBeenCalled();
  }));

  it('should handle error when fetching plans', fakeAsync(() => {
    spyOn(console, 'error');
    planService.getPlans.and.returnValue(throwError(() => new Error('Error fetching plans')));
    component.ngOnInit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error fetching plans:', jasmine.any(Error));
  }));

  it('should navigate to "/plan/pay" when a plan is selected', fakeAsync(() => {
    const selectedPlan = mockPlans.plans[0];
    component.selectPlan(selectedPlan);
    tick();
    expect(formDataService.setFormData).toHaveBeenCalledWith({ plan: selectedPlan });
    expect(router.navigate).toHaveBeenCalledWith(['/plan/pay']);
  }));

  it('should render the correct number of plan cards', () => {
    component.plans = mockPlans;
    fixture.detectChanges();
    const planCards = fixture.debugElement.queryAll(By.css('.plan-card'));
    expect(planCards.length).toBe(mockPlans.plans.length);
  });

  it('should display plan details correctly', () => {
    component.plans = mockPlans;
    fixture.detectChanges();
    const planNameElements = fixture.debugElement.queryAll(By.css('.card-name'));
    const planPriceElements = fixture.debugElement.queryAll(By.css('.card-price'));

    planNameElements.forEach((nameEl, index) => {
      expect(nameEl.nativeElement.textContent).toContain(mockPlans.plans[index].name);
    });
    planPriceElements.forEach((priceEl, index) => {
      expect(priceEl.nativeElement.textContent).toContain(`$${mockPlans.plans[index].price}`);
    });
  });
});
