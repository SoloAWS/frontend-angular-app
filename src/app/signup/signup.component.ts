import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
    FormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  selectedCountry?: string;
  selectedCity?: string;
  filteredCities: string[] = [];

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
    this.selectedCity = '';
  }

}
