export class Company {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  phone_number: string;
  username: string;
  country: string;
  city: string;
  password: string;

  constructor(
    id: number,
    name: string,
    first_name: string,
    last_name: string,
    birth_date: string,
    phone_number: string,
    username: string,
    country: string,
    city: string,
    password: string
  ) {
    this.id = id;
    this.name = name;
    this.first_name = first_name;
    this.last_name = last_name;
    this.birth_date = birth_date;
    this.phone_number = phone_number;
    this.username = username;
    this.country = country;
    this.city = city;
    this.password = password;
  }
}