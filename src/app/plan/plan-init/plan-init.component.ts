import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-plan-init',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './plan-init.component.html',
  styleUrl: './plan-init.component.css'
})
export class PlanInitComponent {

}
