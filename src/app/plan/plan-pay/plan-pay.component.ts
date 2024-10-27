import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardInfo, Company, Pay, Plan } from '../../models';
import { FormDataService } from '../../form-data.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PlanService } from '../plan.service';

@Component({
  selector: 'app-plan-pay',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './plan-pay.component.html',
  styleUrl: './plan-pay.component.css'
})
export class PlanPayComponent implements OnInit {
  payForm: FormGroup;
  plan: Plan | null = null;
  company: Company | null = null;

  constructor(
    private fb: FormBuilder,
    private formDataService: FormDataService,
    private planService: PlanService
  ) {
    this.payForm = this.fb.group(
      {
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/)]],
        expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
        cardHolderName: ['', [Validators.required, Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      }
    );
  }

  ngOnInit(): void {
    const formData = this.formDataService.getFormData();

    if (formData && formData.plan) {
      this.plan = formData.plan;
      sessionStorage.setItem('plan', JSON.stringify(this.plan));
    } else {
      const storedPlan = sessionStorage.getItem('plan');
      if (storedPlan) {
        const planData = JSON.parse(storedPlan);
        this.plan = new Plan(planData.id, planData.name, planData.price, [], planData.currency);
      } else {
        console.error('Plan is missing.');
      }
    }

    if (formData && formData.company) {
      this.company = formData.company;
      sessionStorage.setItem('company', JSON.stringify(this.company));
    } else {
      const storedCompany = sessionStorage.getItem('company');
      if (storedCompany) {
        const companyData = JSON.parse(storedCompany);
        this.company = new Company(companyData.id, companyData.name, companyData.first_name,
          companyData.last_name, companyData.birth_date, companyData.phone_number, companyData.username,
          companyData.country, companyData.city, companyData.password);
      } else {
        console.error('Plan is missing.');
      }
    }
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 16) {
      value = value.slice(0, 16);
    }

    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');

    input.value = value;
    this.payForm.get('cardNumber')?.setValue(value, { emitEvent: false });
  }

  allowOnlyNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
  }

  formatExpirationDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    input.value = value;
    this.payForm.get('expirationDate')?.setValue(value, { emitEvent: false });
  }

  getErrorMessage(controlName: string): string {
    const control = this.payForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('pattern')) {
      switch (controlName) {
        case 'cardNumber':
          return 'El número de tarjeta debe tener 16 dígitos';
        case 'expirationDate':
          return 'La fecha de expiración debe tener el formato MM/AA';
        case 'cvv':
          return 'El CVV debe tener 3 dígitos';
        case 'cardHolderName':
          return 'El nombre del titular debe ser alfanumérico';
      }
    }
    if (control?.hasError('minlength')) {
      return 'El nombre del titular debe tener al menos 3 caracteres';
    }
    if (control?.hasError('maxlength')) {
      return 'El nombre del titular no puede tener más de 50 caracteres';
    }
    return '';
  }

  onSubmit() {
    if (this.payForm.valid) {
      const cardInfo = new CardInfo(
          this.payForm.value.cardNumber.replace(/\s/g, ''), 
          this.payForm.value.expirationDate,
          this.payForm.value.cvv,
          this.payForm.value.cardHolderName
      );

      const payRequest = new Pay(
          this.plan?.id || '',
          this.company?.id || '',
          cardInfo
      );

      this.planService.assignPlan(payRequest).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
        },
        error: (error) => {
          console.error('Error registering user', error);
        },
      });
    }
  }
}
