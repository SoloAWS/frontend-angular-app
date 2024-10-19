import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentService } from '../incident.service';
import { Document, UserCompanies } from '../../models';
import { Router } from '@angular/router';
import { FormDataService } from '../../form-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incident-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.css'
})
export class IncidentCreateComponent {
  incidentForm: FormGroup;
  documentTypes: string[] = ['passport', 'cc']
  userCompanies: UserCompanies = { user_id: '', companies: [] };

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private formDataService: FormDataService,
    private router: Router
  ) {
    this.incidentForm = this.fb.group(
      {
        documentId: ['', Validators.required],
        documentType: ['', Validators.required],
        company: ['', Validators.required],
      }
    );
  }

  fetchCompanies() {
    const documentType = this.incidentForm.get('documentType')?.value;
    const documentId = this.incidentForm.get('documentId')?.value;

    if (documentType && documentId) {
      const userDocument: Document = new Document(documentType, documentId);

      this.incidentService.getCompaniesByDocument(userDocument).subscribe(
        (response: UserCompanies) => {
          this.userCompanies = response;
        },
        (error) => {
          console.error('Error fetching companies:', error);
        }
      );
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.incidentForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }

  onSubmit() {
    if (this.incidentForm.valid) {
      const selectedCompanyId = this.incidentForm.get('company')?.value;
      const userId = this.userCompanies.user_id;

      this.formDataService.setFormData({
        user_id: userId,
        company_id: selectedCompanyId
      });

      this.router.navigate(['/incident/details']);
    }
  }
}
