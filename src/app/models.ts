export class Document {
  document_type: string;
  document_id: string;

  constructor(document_type: string, document_id: string) {
    this.document_type = document_type;
    this.document_id = document_id;
  }
}

export class UserCompanies {
  user_id: string;
  companies: CompanyResponse[];

  constructor(user_id: string, companies: Company[]) {
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

export class CompanyResponse {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  phone_number: string;
  username: string;
  country: string;
  city: string;

  constructor(
    id: string,
    name: string,
    first_name: string,
    last_name: string,
    birth_date: string,
    phone_number: string,
    username: string,
    country: string,
    city: string
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
  }
}

export class UserDetailRequest {
  user_id: string;
  company_id: string;

  constructor(user_id: string, company_id: string) {
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

export class IncidentCreate {
  user_id: string;
  company_id: string;
  description: string;
  state: string;
  channel: string;
  priority: string;

  constructor(
    user_id: string,
    company_id: string,
    description: string,
    state: string,
    channel: string,
    priority: string
  ) {
    this.user_id = user_id;
    this.company_id = company_id;
    this.description = description;
    this.state = state;
    this.channel = channel;
    this.priority = priority;
  }
}

export class Feature {
  description: string;

  constructor(description: string) {
    this.description = description;
  }
}

export class Plan {
  id: string;
  name: string;
  price: number;
  features: Feature[];
  currency: string;

  constructor(
    id: string,
    name: string,
    price: number,
    features: Feature[],
    currency: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.features = features.map((feature) => new Feature(feature.description));
    this.currency = currency;
  }
}

export class PlanList {
  plans: Plan[];

  constructor(plans: Plan[]) {
    this.plans = plans.map(
      (plan) =>
        new Plan(plan.id, plan.name, plan.price, plan.features, plan.currency)
    );
  }
}

export class CardInfo {
  card_number: string;
  expiration_date: string;
  cvv: string;
  card_holder_name: string;

  constructor(
    card_number: string,
    expiration_date: string,
    cvv: string,
    card_holder_name: string
  ) {
    this.card_number = card_number;
    this.expiration_date = expiration_date;
    this.cvv = cvv;
    this.card_holder_name = card_holder_name;
  }
}

export class Pay {
  plan_id: string;
  company_id: string;
  card_info: CardInfo;

  constructor(plan_id: string, company_id: string, card_info: CardInfo) {
    this.plan_id = plan_id;
    this.company_id = company_id;
    this.card_info = card_info;
  }
}

export class Subscription {
  subscription_id: string;
  status: string;
  message: string;
  plan_id: string;
  company_id: string;

  constructor(
    subscription_id: string,
    status: string,
    message: string,
    plan_id: string,
    company_id: string
  ) {
    this.subscription_id = subscription_id;
    this.status = status;
    this.message = message;
    this.plan_id = plan_id;
    this.company_id = company_id;
  }
}

export class IncidentList {
  id: string;
  description: string;
  state: string;
  channel: string;
  priority: string;
  creation_date: string;
  user_id: string;
  company_id: string;
  company_name: string;
  manager_id: string | null;

  constructor(
    id: string,
    description: string,
    state: string,
    channel: string,
    priority: string,
    creation_date: string,
    user_id: string,
    company_id: string,
    company_name: string,
    manager_id: string | null
  ) {
    this.id = id;
    this.description = description;
    this.state = state;
    this.channel = channel;
    this.priority = priority;
    this.creation_date = creation_date;
    this.user_id = user_id;
    this.company_id = company_id;
    this.company_name = company_name;
    this.manager_id = manager_id;
  }
}

export class IncidentListResponse {
  incidents: IncidentList[];

  constructor(incidents: IncidentList[]) {
    this.incidents = incidents;
  }
}

export class UserDetails {
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
    registration_date: string
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
  }
}

export class ManagerDetails {
  id: string;
  username: string;
  first_name: string;
  last_name: string;

  constructor(
    id: string,
    username: string,
    first_name: string,
    last_name: string
  ) {
    this.id = id;
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
  }
}

export class HistoryItem {
  description: string;
  created_at: string;

  constructor(description: string, created_at: string) {
    this.description = description;
    this.created_at = created_at;
  }
}

export class IncidentDetail {
  id: string;
  description: string;
  state: string;
  channel: string;
  priority: string;
  creation_date: string;
  user_id: string;
  user_details: UserDetails;
  company_id: string;
  company_name: string;
  manager_id: string;
  manager_details: ManagerDetails;
  history: HistoryItem[];

  constructor(
    id: string,
    description: string,
    state: string,
    channel: string,
    priority: string,
    creation_date: string,
    user_id: string,
    user_details: UserDetails,
    company_id: string,
    company_name: string,
    manager_id: string,
    manager_details: ManagerDetails,
    history: HistoryItem[]
  ) {
    this.id = id;
    this.description = description;
    this.state = state;
    this.channel = channel;
    this.priority = priority;
    this.creation_date = creation_date;
    this.user_id = user_id;
    this.user_details = user_details;
    this.company_id = company_id;
    this.company_name = company_name;
    this.manager_id = manager_id;
    this.manager_details = manager_details;
    this.history = history;
  }
}

export interface DashboardStats {
  totalCalls: number;
  averageHandlingTime: string;
  customerSatisfaction: number;
  openTickets: number;
}

export interface CallVolumeData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export interface CustomerSatisfactionData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

export interface DashboardData {
  stats: DashboardStats;
  callVolume: CallVolumeData;
  customerSatisfaction: CustomerSatisfactionData;
  recentIncidents: IncidentList[];
}

export interface DailyStats {
  incidentsHandled: number;
  avgResolutionTime: string;
  customerSatisfaction: number;
}
