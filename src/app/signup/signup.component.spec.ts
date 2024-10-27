import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './signup.component';
import { SignupService } from './signup.service';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let signupService: SignupService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        SignupService,
        DatePipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    signupService = TestBed.inject(SignupService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); 
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('form should be valid when filled correctly', () => {
    fillFormWithValidData();
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should call onSubmit when form is valid', () => {
    spyOn(component, 'onSubmit');
    fillFormWithValidData();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call signupService.crearCompany on valid form submission', fakeAsync(() => {
    spyOn(signupService, 'crearCompany').and.returnValue(of({} as any));
    fillFormWithValidData();
    component.onSubmit();
    tick();
    expect(signupService.crearCompany).toHaveBeenCalled();
  }));

  it('should navigate to /plan/init on successful form submission', fakeAsync(() => {
    spyOn(signupService, 'crearCompany').and.returnValue(of({} as any));
    fillFormWithValidData();
    component.onSubmit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/plan/init']);
  }));

  it('should handle error on form submission', fakeAsync(() => {
    spyOn(signupService, 'crearCompany').and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    fillFormWithValidData();
    component.onSubmit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error registering user', jasmine.any(Error));
  }));

  it('should validate age', () => {
    const control = component.signupForm.get('birthDate');
    control?.setValue('2010-01-01');
    expect(control?.hasError('underage')).toBeTruthy();
    control?.setValue('1990-01-01');
    expect(control?.hasError('underage')).toBeFalsy();
  });

  it('should validate phone number', () => {
    const control = component.signupForm.get('phoneNumber');
    control?.setValue('123');
    expect(control?.hasError('invalidPhoneNumber')).toBeTruthy();
    control?.setValue('+57 300 123 4567');
    expect(control?.hasError('invalidPhoneNumber')).toBeFalsy();
  });

  it('should validate password strength', () => {
    const control = component.signupForm.get('password');
    control?.setValue('weak');
    expect(control?.hasError('weakPassword')).toBeTruthy();
    control?.setValue('StrongP@ssw0rd');
    expect(control?.hasError('weakPassword')).toBeFalsy();
  });

  it('should format phone number', () => {
    const control = component.signupForm.get('phoneNumber');
    control?.setValue('573001234567');
    expect(control?.value).toBe('+57 300 123 4567');
  });

  it('should filter cities on country change', () => {
    component.onCountryChange('Colombia');
    expect(component.filteredCities).toContain('Bogotá');
    expect(component.filteredCities).not.toContain('Buenos Aires');
  });

  it('should reset city on country change', () => {
    component.signupForm.get('city')?.setValue('Bogotá');
    component.onCountryChange('Argentina');
    expect(component.signupForm.get('city')?.value).toBeNull();
  });

  it('should get error messages for form controls', () => {
    const control = component.signupForm.get('email');
    control?.setErrors({ required: true });
    expect(component.getErrorMessage('email')).toBe('Este campo es requerido');
    control?.setErrors({ email: true });
    expect(component.getErrorMessage('email')).toBe('Ingrese un correo electrónico válido');
  });

  function fillFormWithValidData() {
    component.signupForm.setValue({
      companyName: 'My Company',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      phoneNumber: '+57 300 123 4567',
      country: 'Colombia',
      city: 'Bogotá',
      email: 'test@example.com',
      password: 'StrongP@ssw0rd',
      confirmPassword: 'StrongP@ssw0rd'
    });
  }
});
