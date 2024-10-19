import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
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
  user_id: string = '';
  company_id: string = '';
  userDetails: User | null = null;

  constructor(
    private formDataService: FormDataService,
    private incidentService: IncidentService
  ) { }

  ngOnInit(): void {
    // Retrieve the user_id and company_id from FormDataService
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
}
