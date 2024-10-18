import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentService } from '../incident.service';
import { Company, Document, UserCompanies } from '../../models';

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
  ],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.css'
})
export class IncidentCreateComponent {
  incidentForm: FormGroup;
  documentTypes: string[] = ['passport', 'cc']
  filteredCompanies: Company[] = [];

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
  ) {
    this.incidentForm = this.fb.group(
      {
        documentId: ['', Validators.required],
        documentType: ['', Validators.required],
        company: ['', Validators.required],
      }
    );
  }

  ngOnInit(): void {
  }

  fetchCompanies() {
    const documentType = this.incidentForm.get('documentType')?.value;
    const documentId = this.incidentForm.get('documentId')?.value;

    if (documentType && documentId) {
      const userDocument: Document = new Document(documentType, documentId);

      this.incidentService.getCompaniesByDocument(userDocument).subscribe(
        (response: UserCompanies) => {
          this.filteredCompanies = response.companies;
        },
        (error) => {
          console.error('Error fetching companies:', error);
        }
      );
    }
  }

  onSubmit() {
  }
}
