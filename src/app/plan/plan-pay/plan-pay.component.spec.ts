import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanPayComponent } from './plan-pay.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlanService } from '../plan.service';
import { FormDataService } from '../../form-data.service';
import { of, throwError } from 'rxjs';
import { Plan, Company, CardInfo, Pay, Subscription } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

describe('PlanPayComponent', () => {
  let component: PlanPayComponent;
  let fixture: ComponentFixture<PlanPayComponent>;
  let planService: jasmine.SpyObj<PlanService>;
  let formDataService: jasmine.SpyObj<FormDataService>;

  const mockPlan = new Plan('1', 'Premium Plan', 49.99, [], 'USD');
  const mockCompany = new Company('1', 'Test Company', 'John', 'Doe', '1990-01-01', '1234567890', 'johndoe', 'USA', 'New York', 'password123');

  beforeEach(async () => {
    const planServiceSpy = jasmine.createSpyObj('PlanService', ['assignPlan']);
    const formDataServiceSpy = jasmine.createSpyObj('FormDataService', ['getFormData']);

    await TestBed.configureTestingModule({
      imports: [
        PlanPayComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: PlanService, useValue: planServiceSpy },
        { provide: FormDataService, useValue: formDataServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanPayComponent);
    component = fixture.componentInstance;
    planService = TestBed.inject(PlanService) as jasmine.SpyObj<PlanService>;
    formDataService = TestBed.inject(FormDataService) as jasmine.SpyObj<FormDataService>;

    formDataService.getFormData.and.returnValue({ plan: mockPlan, company: mockCompany });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize plan and company from FormDataService', () => {
    component.ngOnInit();
    expect(component.plan).toEqual(mockPlan);
    expect(component.company).toEqual(mockCompany);
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.payForm.valid).toBeFalse();
  });

  it('should format card number correctly', () => {
    const inputEvent = { target: { value: '1234567890123456' } } as any;
    component.formatCardNumber(inputEvent);
    expect(component.payForm.get('cardNumber')?.value).toBe('1234 5678 9012 3456');
  });

  it('should format expiration date correctly', () => {
    const inputEvent = { target: { value: '1223' } } as any;
    component.formatExpirationDate(inputEvent);
    expect(component.payForm.get('expirationDate')?.value).toBe('12/23');
  });

  it('should validate card number using Luhn algorithm', () => {
    component.payForm.get('cardNumber')?.setValue('1234 5678 9012 3456');
    expect(component.payForm.get('cardNumber')?.hasError('invalidCardNumber')).toBeTrue();

    component.payForm.get('cardNumber')?.setValue('4539 1488 0343 6467'); // Valid Luhn number
    expect(component.payForm.get('cardNumber')?.hasError('invalidCardNumber')).toBeFalse();
  });

  it('should not submit form if card number is invalid', () => {
    component.payForm.setValue({
      cardNumber: '1234 5678 9012 3456', // Invalid Luhn
      expirationDate: '12/23',
      cvv: '123',
      cardHolderName: 'John Doe'
    });

    component.onSubmit();

    expect(planService.assignPlan).not.toHaveBeenCalled();
  });

  it('should validate expiration date format correctly', () => {
    const expirationDateControl = component.payForm.get('expirationDate');

    expirationDateControl?.setValue('13/23');
    expect(expirationDateControl?.hasError('pattern')).toBeTrue();

    expirationDateControl?.setValue('11/23');
    expect(expirationDateControl?.hasError('pattern')).toBeFalse();
  });

  it('should validate CVV as 3 digits', () => {
    const cvvControl = component.payForm.get('cvv');

    cvvControl?.setValue('12');
    expect(cvvControl?.hasError('pattern')).toBeTrue();

    cvvControl?.setValue('123');
    expect(cvvControl?.hasError('pattern')).toBeFalse();
  });

  it('should restrict card holder name length', () => {
    const cardHolderNameControl = component.payForm.get('cardHolderName');

    cardHolderNameControl?.setValue('Jo');
    expect(cardHolderNameControl?.hasError('minlength')).toBeTrue();

    cardHolderNameControl?.setValue('John Doe');
    expect(cardHolderNameControl?.hasError('minlength')).toBeFalse();

    cardHolderNameControl?.setValue('J'.repeat(51));
    expect(cardHolderNameControl?.hasError('maxlength')).toBeTrue();
  });

  it('should prevent non-numeric input in CVV and card number fields', () => {
    const cvvInputEvent = { target: { value: 'abc' } } as any;
    component.allowOnlyNumbers(cvvInputEvent);
    expect(cvvInputEvent.target.value).toBe('');

    const cardNumberInputEvent = { target: { value: 'abcd5678' } } as any;
    component.allowOnlyNumbers(cardNumberInputEvent);
    expect(cardNumberInputEvent.target.value).toBe('5678');
  });
});
