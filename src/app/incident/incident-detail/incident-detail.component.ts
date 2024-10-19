import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

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
export class IncidentDetailComponent {

}
