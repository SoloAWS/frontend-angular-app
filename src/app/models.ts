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

export class UserDetailRequest {
    user_id: string;
    company_id: string;

    constructor(
        user_id: string,
        company_id: string,
    ) {
        this.user_id = user_id;
        this.company_id = company_id;
    }
}

export class Incident {
    id: string;
    description: string;
    state: string;
    creation_date: string;

    constructor(
        id: string,
        description: string,
        state: string,
        creation_date: string
    ) {
        this.id = id;
        this.description = description;
        this.state = state;
        this.creation_date = creation_date;
    }
}

export class User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    document_id: string;
    document_type: string;
    birth_date: string;
    phone_number: string;
    importance: number;
    allow_call: boolean;
    allow_sms: boolean;
    allow_email: boolean;
    registration_date: string;
    incidents: Incident[];

    constructor(
        id: string,
        username: string,
        first_name: string,
        last_name: string,
        document_id: string,
        document_type: string,
        birth_date: string,
        phone_number: string,
        importance: number,
        allow_call: boolean,
        allow_sms: boolean,
        allow_email: boolean,
        registration_date: string,
        incidents: Incident[]
    ) {
        this.id = id;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.document_id = document_id;
        this.document_type = document_type;
        this.birth_date = birth_date;
        this.phone_number = phone_number;
        this.importance = importance;
        this.allow_call = allow_call;
        this.allow_sms = allow_sms;
        this.allow_email = allow_email;
        this.registration_date = registration_date;
        this.incidents = incidents;
    }
}
