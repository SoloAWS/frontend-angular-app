export class Document {
    document_type: string;
    document_id: string;

    constructor(
        document_type: string,
        document_id: string,
    ) {
        this.document_type = document_type;
        this.document_id = document_id;
    }
}

export class UserCompanies {
    user_id: string;
    companies: Company[];

    constructor(
        user_id: string,
        companies: Company[],
    ) {
        this.user_id = user_id;
        this.companies = companies;
    }
}

export class Company {
    id: string;
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
      id: string,
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