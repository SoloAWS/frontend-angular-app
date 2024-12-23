import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SignupService } from './signup.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Company } from '../models';
import { FormDataService } from '../form-data.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../login/auth.service';

interface Country {
  name: string;
  cities: string[];
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  filteredCities: string[] = [];
  selectedLanguage = 'es';

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private datePipe: DatePipe,
    private formDataService: FormDataService,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
  ) {
    this.signupForm = this.fb.group(
      {
        companyName: ['', [Validators.required, Validators.minLength(2)]],
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        birthDate: ['', [Validators.required, this.ageValidator()]],
        phoneNumber: ['', [Validators.required, this.phoneNumberValidator()]],
        country: ['', Validators.required],
        city: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator(),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.signupForm.get('phoneNumber')?.valueChanges.subscribe((value) => {
      if (value) {
        const formattedValue = this.formatPhoneNumber(value);
        this.signupForm
          .get('phoneNumber')
          ?.setValue(formattedValue, { emitEvent: false });
      }
    });
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
    this.selectedLanguage = savedLanguage.toUpperCase();
    this.translate.use(savedLanguage);
  }

  changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  ageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        const today = new Date();
        const birthDate = new Date(control.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        if (age < 18) {
          return { underage: true };
        }
      }
      return null;
    };
  }

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^\+[0-9]{1,3}\s[0-9]{3}\s[0-9]{3}\s[0-9]{4}$/.test(
        control.value
      );
      return valid ? null : { invalidPhoneNumber: { value: control.value } };
    };
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;
      if (password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const valid =
          hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        if (!valid) {
          return { weakPassword: true };
        }
      }
      return null;
    };
  }

  passwordMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): { [key: string]: any } | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword');

    if (password !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  };


  formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '');

    let formatted = '';
    if (digits.length > 0) {
      formatted += '+' + digits.substring(0, Math.min(2, digits.length));
    }
    if (digits.length > 2) {
      formatted += ' ' + digits.substring(2, Math.min(5, digits.length));
    }
    if (digits.length > 5) {
      formatted += ' ' + digits.substring(5, Math.min(8, digits.length));
    }
    if (digits.length > 8) {
      formatted += ' ' + digits.substring(8, 12);
    }

    return formatted;
  }

  countries: Country[] = [
    {
      name: 'Colombia',
      cities: [
        'Bogotá',
        'Medellín',
        'Cali',
        'Cartagena',
        'Barranquilla',
        'Bucaramanga',
      ],
    },
    {
      name: 'Argentina',
      cities: [
        'Buenos Aires',
        'Córdoba',
        'Rosario',
        'Mendoza',
        'La Plata',
        'Mar del Plata',
      ],
    },
    {
      name: 'Ecuador',
      cities: ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Ambato', 'Loja'],
    },
    {
      name: 'México',
      cities: [
        'Ciudad de México',
        'Guadalajara',
        'Monterrey',
        'Puebla',
        'Cancún',
        'Tijuana',
      ],
    },
    {
      name: 'Perú',
      cities: ['Lima', 'Cusco', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura'],
    },
    {
      name: 'Chile',
      cities: [
        'Santiago',
        'Valparaíso',
        'Concepción',
        'La Serena',
        'Antofagasta',
        'Temuco',
      ],
    },
    {
      name: 'Brasil',
      cities: [
        'São Paulo',
        'Río de Janeiro',
        'Brasilia',
        'Salvador',
        'Fortaleza',
        'Belo Horizonte',
      ],
    },
    {
      name: 'España',
      cities: [
        'Madrid',
        'Barcelona',
        'Valencia',
        'Sevilla',
        'Bilbao',
        'Málaga',
      ],
    },
    {
      name: 'Estados Unidos',
      cities: [
        'Nueva York',
        'Los Ángeles',
        'Chicago',
        'Houston',
        'Miami',
        'San Francisco',
      ],
    },
    {
      name: 'Canadá',
      cities: [
        'Toronto',
        'Vancouver',
        'Montreal',
        'Ottawa',
        'Calgary',
        'Edmonton',
      ],
    },
    {
      name: 'Francia',
      cities: ['París', 'Marsella', 'Lyon', 'Toulouse', 'Niza', 'Nantes'],
    },
    {
      name: 'Italia',
      cities: ['Roma', 'Milán', 'Nápoles', 'Turín', 'Venecia', 'Florencia'],
    },
    {
      name: 'Alemania',
      cities: [
        'Berlín',
        'Múnich',
        'Hamburgo',
        'Fráncfort',
        'Colonia',
        'Stuttgart',
      ],
    },
    {
      name: 'Japón',
      cities: ['Tokio', 'Osaka', 'Yokohama', 'Nagoya', 'Kioto', 'Sapporo'],
    },
    {
      name: 'China',
      cities: [
        'Pekín',
        'Shanghái',
        'Cantón',
        'Shenzhen',
        'Chongqing',
        'Tianjin',
      ],
    },
    {
      name: 'Australia',
      cities: [
        'Sídney',
        'Melbourne',
        'Brisbane',
        'Perth',
        'Adelaida',
        'Canberra',
      ],
    },
    {
      name: 'Reino Unido',
      cities: [
        'Londres',
        'Manchester',
        'Birmingham',
        'Edimburgo',
        'Glasgow',
        'Liverpool',
      ],
    },
    {
      name: 'India',
      cities: [
        'Nueva Delhi',
        'Bombay (Mumbai)',
        'Bangalore',
        'Hyderabad',
        'Chennai',
        'Kolkata',
      ],
    },
    {
      name: 'Sudáfrica',
      cities: [
        'Johannesburgo',
        'Ciudad del Cabo',
        'Durban',
        'Pretoria',
        'Port Elizabeth',
        'Bloemfontein',
      ],
    },
    {
      name: 'Egipto',
      cities: [
        'El Cairo',
        'Alejandría',
        'Giza',
        'Sharm el-Sheij',
        'Luxor',
        'Asuán',
      ],
    },
  ];

  onCountryChange(countryName: string) {
    const selected = this.countries.find(
      (country) => country.name === countryName
    );
    this.filteredCities = selected ? selected.cities : [];
    this.signupForm.get('city')?.reset();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formattedBirthDate = this.datePipe.transform(
        this.signupForm.value.birthDate,
        'yyyy-MM-dd'
      );
      const company = new Company(
        '',
        this.signupForm.value.companyName,
        this.signupForm.value.firstName,
        this.signupForm.value.lastName,
        formattedBirthDate!,
        this.signupForm.value.phoneNumber,
        this.signupForm.value.email,
        this.signupForm.value.country,
        this.signupForm.value.city,
        this.signupForm.value.password
      );

      this.signupService.crearCompany(company).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          this.formDataService.setFormData({ company : response });
          sessionStorage.setItem('company', JSON.stringify(response));

          this.authService.login({password  : this.signupForm.value.password, username : this.signupForm.value.email}).subscribe({
            next: () => {
              this.router.navigate(['/plan/init']);
            },
            error: (error) => {
              console.error('Error user login', error);
              this.router.navigate(['/login']);
            },
          });
        },
        error: (error) => {
          console.error('Error registering user', error);
        },
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);

    if (control?.hasError('required')) {
      return this.translate.instant('required');
    }
    if (control?.hasError('email') || control?.hasError('invalidEmail')) {
      return this.translate.instant('email_invalid');
    }
    if (control?.hasError('minlength')) {
      return this.translate.instant('minlength', {
        length: control.errors?.['minlength'].requiredLength,
      });
    }
    if (control?.hasError('maxlength')) {
      return this.translate.instant('maxlength', {
        length: control.errors?.['maxlength'].requiredLength,
      });
    }
    if (control?.hasError('underage')) {
      return this.translate.instant('underage');
    }
    if (control?.hasError('weakPassword')) {
      return this.translate.instant('weak_password');
    }
    if (control?.hasError('passwordMismatch')) {
      return this.translate.instant('password_mismatch');
    }
    if (control?.hasError('invalidName')) {
      return this.translate.instant('invalid_name');
    }
    if (control?.hasError('invalidPhoneNumber')) {
      return this.translate.instant('invalid_phone_number');
    }
    return '';
  }

}
