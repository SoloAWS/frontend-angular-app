import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FormDataService } from '../../form-data.service';
import { IncidentService } from '../incident.service';
import { User, UserDetailRequest } from '../../models';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.css'
})
export class IncidentDetailComponent implements OnInit {
  incidentForm: FormGroup;
  user_id: string = '';
  company_id: string = '';
  userDetails: User | null = null;
  priorities = [
    { label: 'Baja', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' }
  ];

  constructor(
    private fb: FormBuilder,
    private formDataService: FormDataService,
    private incidentService: IncidentService
  ) {
    this.incidentForm = this.fb.group(
      {
        priority: ['', Validators.required],
        documentType: ['', Validators.required],
        company: ['', Validators.required],
      }
    );
   }

  ngOnInit(): void {
    const formData = this.formDataService.getFormData();
    this.user_id = formData.user_id;
    this.company_id = formData.company_id;

    if (this.user_id && this.company_id) {
      const userDetailRequest = new UserDetailRequest(this.user_id, this.company_id);
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

  onSubmit() {
  }
}
