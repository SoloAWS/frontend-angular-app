import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { FormDataService } from '../../form-data.service';
import { IncidentService } from '../incident.service';
import { User, UserDetailRequest } from '../../models';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.css'
})
export class IncidentDetailComponent implements OnInit {
  userDetails: User | null = null;
  formData: any; // To store retrieved form data

  constructor(
    private formDataService: FormDataService,
    private incidentService: IncidentService
  ) { }

  ngOnInit(): void {
    // Retrieve the form data from FormDataService
    this.formData = this.formDataService.getFormData();

    // Extract user_id and company_id from formData (if available)
    if (this.formData && this.formData.documentId && this.formData.company) {
      const userDetailRequest = new UserDetailRequest(this.formData.documentId, this.formData.company);
      this.getUserDetails(userDetailRequest);
    } else {
      console.error("Form data is missing. Ensure data is passed correctly.");
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
}
