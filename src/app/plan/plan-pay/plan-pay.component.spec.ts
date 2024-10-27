import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlanPayComponent } from './plan-pay.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlanService } from '../plan.service';
import { FormDataService } from '../../form-data.service';
import { of, throwError } from 'rxjs';
import { Plan, Company, Pay, CardInfo, Subscription } from '../../models';

describe('PlanPayComponent', () => {
  let component: PlanPayComponent;
  let fixture: ComponentFixture<PlanPayComponent>;
  let planService: jasmine.SpyObj<PlanService>;
  let formDataService: jasmine.SpyObj<FormDataService>;

  const mockPlan = new Plan('1', 'Premium Plan', 49.99, [], 'USD');
  const mockCompany = new Company(
    '1', 'Test Company', 'John', 'Doe', '1990-01-01', 
    '1234567890', 'johndoe', 'USA', 'New York', 'password123'
  );

  beforeEach(async () => {
    const planServiceSpy = jasmine.createSpyObj('PlanService', ['assignPlan']);
    const formDataServiceSpy = jasmine.createSpyObj('FormDataService', ['getFormData']);

    await TestBed.configureTestingModule({
      imports: [
        PlanPayComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
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
    expect(component.payForm.valid).toBeFalsy();
  });

  it('should mark form as valid with correctly filled fields', () => {
    component.payForm.setValue({
      cardNumber: '1234 5678 9012 3456',
      expirationDate: '12/23',
      cvv: '123',
      cardHolderName: 'John Doe'
    });
    expect(component.payForm.valid).toBeTruthy();
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

  it('should submit payment with valid form', fakeAsync(() => {
    const mockResponse = new Subscription('123', 'SUCCESS', 'Payment Successful', mockPlan.id, mockCompany.id);
    planService.assignPlan.and.returnValue(of(mockResponse));
    spyOn(console, 'log');

    component.payForm.setValue({
      cardNumber: '1234 5678 9012 3456',
      expirationDate: '12/23',
      cvv: '123',
      cardHolderName: 'John Doe'
    });

    component.onSubmit();
    tick();
    expect(planService.assignPlan).toHaveBeenCalledWith(new Pay(
      mockPlan.id,
      mockCompany.id,
      new CardInfo('1234567890123456', '12/23', '123', 'John Doe')
    ));
    expect(console.log).toHaveBeenCalledWith('User registered successfully', jasmine.any(Object));
}));

  it('should handle error on payment submission', fakeAsync(() => {
    spyOn(console, 'error');
    planService.assignPlan.and.returnValue(throwError(() => new Error('Payment failed')));

    component.payForm.setValue({
      cardNumber: '1234 5678 9012 3456',
      expirationDate: '12/23',
      cvv: '123',
      cardHolderName: 'John Doe'
    });

    component.onSubmit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error registering user', jasmine.any(Error));
  }));

  it('should display error messages for invalid form fields', () => {
    const cardNumberControl = component.payForm.get('cardNumber');
    cardNumberControl?.setValue('123');
    expect(component.getErrorMessage('cardNumber')).toBe('El número de tarjeta debe tener 16 dígitos');

    const expirationDateControl = component.payForm.get('expirationDate');
    expirationDateControl?.setValue('1323');
    expect(component.getErrorMessage('expirationDate')).toBe('La fecha de expiración debe tener el formato MM/AA');

    const cvvControl = component.payForm.get('cvv');
    cvvControl?.setValue('12');
    expect(component.getErrorMessage('cvv')).toBe('El CVV debe tener 3 dígitos');

    const cardHolderNameControl = component.payForm.get('cardHolderName');
    cardHolderNameControl?.setValue('JD');
    expect(component.getErrorMessage('cardHolderName')).toBe('El nombre del titular debe tener al menos 3 caracteres');
  });
});
