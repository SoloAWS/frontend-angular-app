import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-plan-init',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './plan-init.component.html',
  styleUrl: './plan-init.component.css'
})
export class PlanInitComponent {

}
