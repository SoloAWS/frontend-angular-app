import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FormDataService } from '../../form-data.service';
import { IncidentService } from '../incident.service';
import { IncidentCreate, User, UserDetailRequest } from '../../models';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IncidentDetailService } from './incident-detail.service';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.css',
})
export class IncidentDetailComponent implements OnInit {
  incidentForm: FormGroup;
  user_id: string = '';
  company_id: string = '';
  userDetails: User | null = null;
  priorities = [
    { label: 'Baja', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' },
  ];
  conocimiento: string = '';
  ia: string = '';

  constructor(
    private fb: FormBuilder,
    private formDataService: FormDataService,
    private incidentService: IncidentService,
    private incidentDetailService: IncidentDetailService
  ) {
    this.incidentForm = this.fb.group({
      priority: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const formData = this.formDataService.getFormData();

    if (formData && formData.user_id && formData.company_id) {
      this.user_id = formData.user_id;
      this.company_id = formData.company_id;
      sessionStorage.setItem('user_id', this.user_id);
      sessionStorage.setItem('company_id', this.company_id);
    } else {
      const storedUserId = sessionStorage.getItem('user_id');
      const storedCompanyId = sessionStorage.getItem('company_id');

      if (storedUserId && storedCompanyId) {
        this.user_id = storedUserId;
        this.company_id = storedCompanyId;
      } else {
        console.error('User ID and Company ID are missing.');
      }
    }
    if (this.user_id && this.company_id) {
      const userDetailRequest = new UserDetailRequest(
        this.user_id,
        this.company_id
      );
      this.getUserDetails(userDetailRequest);
    }
  }

  getUserDetails(userDetailRequest: UserDetailRequest): void {
    this.incidentService.getUserDetails(userDetailRequest).subscribe(
      (user: User) => {
        this.userDetails = user;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.incidentForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }

  translateState(state: string): string {
    const stateTranslations: { [key: string]: string } = {
      open: 'Abierto',
      closed: 'Resuelto',
      in_progress: 'En progreso',
      escalated: 'Escalado',
    };

    return stateTranslations[state] || state;
  }

  generateRandomSentence(): string {
    const phrases = [
      'Verificar configuración de la cuenta',
      'Actualizar información de facturación',
      'Reiniciar el dispositivo del cliente',
      'Comprobar conexión a internet',
      'Contactar al soporte técnico',
      'Realizar una prueba de velocidad',
      'Actualizar el firmware del dispositivo',
      'Revisar las credenciales de acceso',
      'Reiniciar el router',
      'Actualizar datos de contacto',
    ];

    const randomPhrases = [];
    const numberOfPhrases = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < numberOfPhrases; i++) {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      randomPhrases.push(phrases[randomIndex]);
    }

    return randomPhrases.map((phrase) => `- ${phrase}`).join('\n');
  }

  getSimilarIncidents(): void {
    const prompt = this.incidentForm.value.description;
    this.incidentDetailService.generateResponse(prompt).subscribe(
      (response) => {
        this.conocimiento = response.response;
      },
      (error) => {
        console.error('Error fetching similar incidents:', error);
      }
    );
  }

  getIAResponse(): void {
    const prompt = this.incidentForm.value.description;
    this.incidentDetailService.generateResponse(prompt).subscribe(
      (response) => {
        this.ia = response.response;
      },
      (error) => {
        console.error('Error generating IA response:', error);
      }
    );
  }

  onSubmit() {
    if (this.incidentForm.valid) {
      const incident = new IncidentCreate(
        this.user_id,
        this.company_id,
        this.incidentForm.value.description,
        'open',
        'phone',
        this.incidentForm.value.priority
      );

      this.incidentService.crearIncident(incident).subscribe({
        next: (response) => {
          console.log('Incident registered successfully', response);
        },
        error: (error) => {
          console.error('Error registering incident', error);
        },
      });
    }
  }
}
