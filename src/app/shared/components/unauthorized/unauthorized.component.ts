import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <h1>Acceso No Autorizado</h1>
      <p>Lo sentimos, no tienes permiso para acceder a esta página.</p>
      <button (click)="goBack()">Volver</button>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      text-align: center;
      padding: 2rem;
    }
    button {
      padding: 0.5rem 1rem;
      margin-top: 1rem;
      cursor: pointer;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }
}
