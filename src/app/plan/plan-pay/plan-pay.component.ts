import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CardInfo, Company, Pay, Plan } from '../../models';
import { FormDataService } from '../../form-data.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PlanService } from '../plan.service';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plan-pay',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './plan-pay.component.html',
  styleUrl: './plan-pay.component.css'
})
export class PlanPayComponent implements OnInit {
  payForm: FormGroup;
  plan: Plan | null = null;
  company: Company | null = null;
  private translate = inject(TranslateService);

  constructor(
    private fb: FormBuilder,
    private formDataService: FormDataService,
    private planService: PlanService,
    private router: Router
  ) {
    this.payForm = this.fb.group(
      {
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/), luhnValidator()]],
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
        return this.translate.instant('required_field');
    }
    if (control?.hasError('pattern')) {
        switch (controlName) {
            case 'cardNumber':
                return this.translate.instant('invalid_card_number_format');
            case 'expirationDate':
                return this.translate.instant('invalid_expiration_date_format');
            case 'cvv':
                return this.translate.instant('invalid_cvv_format');
            case 'cardHolderName':
                return this.translate.instant('invalid_cardholder_name');
        }
    }
    if (control?.hasError('invalidCardNumber')) {
        return this.translate.instant('invalid_card_number');
    }
    if (control?.hasError('minlength')) {
        return this.translate.instant('min_length', {
            length: control.errors?.['minlength']?.requiredLength,
        });
    }
    if (control?.hasError('maxlength')) {
        return this.translate.instant('max_length', {
            length: control.errors?.['maxlength']?.requiredLength,
        });
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
          this.router.navigate(['/incident/dashboard']);
        },
        error: (error) => {
          console.error('Error registering user', error);
        },
      });
    }
  }
}

export function luhnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cardNumber = control.value.replace(/\s/g, '');
    if (!cardNumber || !/^\d+$/.test(cardNumber)) {
      return { invalidCardNumber: 'Card number must contain only digits' };
    }

    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return (sum % 10 === 0) ? null : { invalidCardNumber: 'Invalid card number' };
  };
}
