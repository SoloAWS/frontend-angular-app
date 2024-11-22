import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentDetailComponent } from './incident-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IncidentService } from '../incident.service';
import { FormDataService } from '../../form-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { User, UserDetailRequest, IncidentCreate } from '../../models';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('IncidentDetailComponent', () => {
  let component: IncidentDetailComponent;
  let fixture: ComponentFixture<IncidentDetailComponent>;
  let incidentService: jasmine.SpyObj<IncidentService>;
  let formDataService: jasmine.SpyObj<FormDataService>;

  const mockUserDetails: User = {
    id: '1',
    username: 'johndoe',
    first_name: 'John',
    last_name: 'Doe',
    document_id: '123456',
    document_type: 'passport',
    birth_date: '1990-01-01',
    phone_number: '1234567890',
    importance: 7,
    allow_call: true,
    allow_sms: true,
    allow_email: true,
    registration_date: '2023-01-01',
    incidents: [{
      id: '1',
      description: 'Test incident',
      state: 'open',
      creation_date: '2024-01-01',
    }]
  };

  beforeEach(async () => {
    const incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['getUserDetails', 'crearIncident']);
    const formDataServiceSpy = jasmine.createSpyObj('FormDataService', ['getFormData', 'setFormData']);

    await TestBed.configureTestingModule({
      imports: [
        IncidentDetailComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
          defaultLanguage: 'es',
        }),
      ],
      providers: [
        { provide: IncidentService, useValue: incidentServiceSpy },
        { provide: FormDataService, useValue: formDataServiceSpy },
        ToastrService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentDetailComponent);
    component = fixture.componentInstance;
    incidentService = TestBed.inject(IncidentService) as jasmine.SpyObj<IncidentService>;
    formDataService = TestBed.inject(FormDataService) as jasmine.SpyObj<FormDataService>;

    formDataService.getFormData.and.returnValue({ user_id: '123', company_id: '456' });
    incidentService.getUserDetails.and.returnValue(of(mockUserDetails));

    const translations = {
      required: 'Este campo es requerido'
    };
    const translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('es', translations);
    translateService.use('es');

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    const priorityControl = component.incidentForm.get('priority');
    const descriptionControl = component.incidentForm.get('description');

    expect(priorityControl).toBeTruthy();
    expect(descriptionControl).toBeTruthy();
  });

  it('should fetch user details on initialization', () => {
    const mockUserDetailRequest = new UserDetailRequest('123', '456');
    
    component.ngOnInit();
    
    expect(incidentService.getUserDetails).toHaveBeenCalledWith(mockUserDetailRequest);
    expect(component.userDetails).toEqual(mockUserDetails);
  });

  it('should show error message when required fields are not filled', () => {
    const priorityControl = component.incidentForm.get('priority');
    priorityControl?.setValue('');
    fixture.detectChanges();

    expect(component.getErrorMessage('priority')).toBe('Este campo es requerido');
  });

  it('should call crearIncident when form is valid and submitted', () => {
    component.incidentForm.setValue({
      priority: 'high',
      description: 'Test incident description'
    });

    const mockIncidentCreate = new IncidentCreate(
      '123',
      '456',
      'Test incident description',
      'open',
      'phone',
      'high'
    );

    incidentService.crearIncident.and.returnValue(of({}));

    component.onSubmit();

    expect(incidentService.crearIncident).toHaveBeenCalledWith(mockIncidentCreate);
  });

  it('should translate state correctly', () => {
    expect(component.translateState('open')).toBe('Abierto');
    expect(component.translateState('closed')).toBe('Resuelto');
    expect(component.translateState('unknown')).toBe('unknown');
  });

  it('should handle missing user or company ID', () => {
    formDataService.getFormData.and.returnValue(null);
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('company_id');

    spyOn(console, 'error');
    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('User ID and Company ID are missing.');
  });

  it('should generate a random sentence for knowledge base suggestions', () => {
    const result = component.generateRandomSentence();
    expect(result).toBeTruthy();
    expect(result.split('\n').length).toBeGreaterThanOrEqual(2);
  });

  it('should show an error toast when description is empty for similar incidents', () => {
    spyOn(component['toastr'], 'error');

    component.incidentForm.get('description')?.setValue('');
    component.getSimilarIncidents();

    expect(component['toastr'].error).toHaveBeenCalledWith(
      'La descripción del incidente es requerida',
      'Error en el formulario',
      jasmine.any(Object)
    );
  });

  it('should set conocimiento when description is provided for similar incidents', () => {
    component.incidentForm.get('description')?.setValue('Test description');
    component.getSimilarIncidents();

    expect(component.conocimiento).toBeTruthy();
  });

  it('should show an error toast when description is empty for IA response', () => {
    spyOn(component['toastr'], 'error');

    component.incidentForm.get('description')?.setValue('');
    component.getIAResponse();

    expect(component['toastr'].error).toHaveBeenCalledWith(
      'La descripción del incidente es requerida',
      'Error en el formulario',
      jasmine.any(Object)
    );
  });

  it('should call incidentDetailService to generate IA response when description is valid', () => {
    const incidentDetailServiceSpy = jasmine.createSpyObj('IncidentDetailService', ['generateResponse']);
    incidentDetailServiceSpy.generateResponse.and.returnValue(of({ response: 'Test IA response' }));
    component['incidentDetailService'] = incidentDetailServiceSpy;

    component.incidentForm.get('description')?.setValue('Test description');
    component.getIAResponse();

    expect(incidentDetailServiceSpy.generateResponse).toHaveBeenCalledWith('Test description');
    expect(component.ia).toBe('Test IA response');
  });

  it('should not set conocimiento if description is empty', () => {
    component.incidentForm.get('description')?.setValue('');
    component.getSimilarIncidents();
    expect(component.conocimiento).toBe('');
  });

  it('should return default translation if state is not found', () => {
    const translation = component.translateState('unknown_state');
    expect(translation).toBe('unknown_state');
  });

});
