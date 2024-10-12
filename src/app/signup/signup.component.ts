import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SignupService } from './signup.service';
import { Company } from './company';
import { CommonModule, DatePipe } from '@angular/common';

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
    CommonModule
  ],
  providers: [DatePipe],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  filteredCities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private datePipe: DatePipe
  ) {
    this.signupForm = this.fb.group({
      companyName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  countries: Country[] = [
    { name: 'Colombia', cities: ['Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla', 'Bucaramanga'] },
    { name: 'Argentina', cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata'] },
    { name: 'Ecuador', cities: ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Ambato', 'Loja'] },
    { name: 'México', cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Cancún', 'Tijuana'] },
    { name: 'Perú', cities: ['Lima', 'Cusco', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura'] },
    { name: 'Chile', cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco'] },
    { name: 'Brasil', cities: ['São Paulo', 'Río de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza', 'Belo Horizonte'] },
    { name: 'España', cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga'] },
    { name: 'Estados Unidos', cities: ['Nueva York', 'Los Ángeles', 'Chicago', 'Houston', 'Miami', 'San Francisco'] },
    { name: 'Canadá', cities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Edmonton'] },
    { name: 'Francia', cities: ['París', 'Marsella', 'Lyon', 'Toulouse', 'Niza', 'Nantes'] },
    { name: 'Italia', cities: ['Roma', 'Milán', 'Nápoles', 'Turín', 'Venecia', 'Florencia'] },
    { name: 'Alemania', cities: ['Berlín', 'Múnich', 'Hamburgo', 'Fráncfort', 'Colonia', 'Stuttgart'] },
    { name: 'Japón', cities: ['Tokio', 'Osaka', 'Yokohama', 'Nagoya', 'Kioto', 'Sapporo'] },
    { name: 'China', cities: ['Pekín', 'Shanghái', 'Cantón', 'Shenzhen', 'Chongqing', 'Tianjin'] },
    { name: 'Australia', cities: ['Sídney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaida', 'Canberra'] },
    { name: 'Reino Unido', cities: ['Londres', 'Manchester', 'Birmingham', 'Edimburgo', 'Glasgow', 'Liverpool'] },
    { name: 'India', cities: ['Nueva Delhi', 'Bombay (Mumbai)', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'] },
    { name: 'Sudáfrica', cities: ['Johannesburgo', 'Ciudad del Cabo', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'] },
    { name: 'Egipto', cities: ['El Cairo', 'Alejandría', 'Giza', 'Sharm el-Sheij', 'Luxor', 'Asuán'] },
  ];
  
  
  onCountryChange(countryName: string) {
    const selected = this.countries.find(country => country.name === countryName);
    this.filteredCities = selected ? selected.cities : [];
    this.signupForm.get('city')?.reset();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formattedBirthDate = this.datePipe.transform(this.signupForm.value.birthDate, 'yyyy-MM-dd');
      const company = new Company(
        0,
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
        },
        error: (error) => {
          console.error('Error registering user', error);
        }
      });
    }
  }

}
