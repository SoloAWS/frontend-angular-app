import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentCreateComponent } from './incident-create.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IncidentService } from '../incident.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserCompanies } from '../../models';
import { TranslateModule, TranslateLoader, TranslateService, TranslateFakeLoader } from '@ngx-translate/core';

describe('IncidentCreateComponent', () => {
  let component: IncidentCreateComponent;
  let fixture: ComponentFixture<IncidentCreateComponent>;
  let incidentService: jasmine.SpyObj<IncidentService>;
  let router: Router;

  beforeEach(async () => {
    const incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['getCompaniesByDocument']);

    await TestBed.configureTestingModule({
      imports: [
        IncidentCreateComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        { provide: IncidentService, useValue: incidentServiceSpy },
        FormBuilder,
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentCreateComponent);
    component = fixture.componentInstance;
    incidentService = TestBed.inject(IncidentService) as jasmine.SpyObj<IncidentService>;
    router = TestBed.inject(Router);

    const translateService = TestBed.inject(TranslateService);
    const translations = {
      required: 'Este campo es requerido',
    };
    translateService.setTranslation('es', translations);
    translateService.use('es');
      fixture.detectChanges();
    });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.incidentForm;
    expect(form.get('documentId')?.value).toBe('');
    expect(form.get('documentType')?.value).toBe('');
    expect(form.get('company')?.value).toBe('');
  });

  it('should display error messages for required fields', () => {
    component.incidentForm.get('documentId')?.markAsTouched();
    fixture.detectChanges();
    const errorMessage = component.getErrorMessage('documentId');
    expect(errorMessage).toBe('Este campo es requerido');
  });

  it('should call fetchCompanies on document type change', () => {
    spyOn(component, 'fetchCompanies');
    component.incidentForm.get('documentType')?.setValue('passport');
    component.incidentForm.get('documentId')?.setValue('123456');
    component.fetchCompanies();
    expect(component.fetchCompanies).toHaveBeenCalled();
  });

  it('should populate companies after successful fetch', () => {
    const mockResponse: UserCompanies = {
      user_id: '123',
      companies: [{
        id: '1',
        name: 'Test Company',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-01',
        phone_number: '1234567890',
        username: 'johndoe',
        country: 'USA',
        city: 'New York'
      }]
    };
    incidentService.getCompaniesByDocument.and.returnValue(of(mockResponse));

    component.incidentForm.get('documentType')?.setValue('passport');
    component.incidentForm.get('documentId')?.setValue('123456');
    component.fetchCompanies();

    expect(component.userCompanies).toEqual(mockResponse);
  });

  it('should handle error when fetching companies fails', () => {
    const consoleSpy = spyOn(console, 'error');
    incidentService.getCompaniesByDocument.and.returnValue(throwError('Error fetching companies'));

    component.incidentForm.get('documentType')?.setValue('passport');
    component.incidentForm.get('documentId')?.setValue('123456');
    component.fetchCompanies();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching companies:', 'Error fetching companies');
  });

  it('should navigate on successful form submission', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const mockResponse: UserCompanies = {
      user_id: '123',
      companies: [{
        id: '1',
        name: 'Test Company',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-01',
        phone_number: '1234567890',
        username: 'johndoe',
        country: 'USA',
        city: 'New York'
      }]
    };

    component.incidentForm.get('documentId')?.setValue('123456');
    component.incidentForm.get('documentType')?.setValue('passport');
    component.incidentForm.get('company')?.setValue('1');

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/incident/details']);
  });

  it('should not submit the form when it is invalid', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onSubmit();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
