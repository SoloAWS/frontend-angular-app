import {
  Document,
  UserCompanies,
  Company,
  CompanyResponse,
  UserDetailRequest,
  Incident,
  User,
  IncidentCreate,
  Feature,
  Plan,
  PlanList,
  CardInfo,
  Pay,
  Subscription,
  IncidentList,
  IncidentListResponse,
  UserDetails,
  ManagerDetails,
  HistoryItem,
  IncidentDetail,
} from './models';

describe('Models', () => {
  // Test Document class
  describe('Document', () => {
    it('should create an instance of Document', () => {
      const doc = new Document('passport', '12345');
      expect(doc.document_type).toBe('passport');
      expect(doc.document_id).toBe('12345');
    });
  });

  // Test UserCompanies class
  describe('UserCompanies', () => {
    it('should create an instance of UserCompanies', () => {
      const companies = [
        new Company(
          '1',
          'Test Co',
          'John',
          'Doe',
          '1990-01-01',
          '123456789',
          'jdoe',
          'USA',
          'NY',
          'password'
        ),
      ];
      const userCompanies = new UserCompanies('user_123', companies);
      expect(userCompanies.user_id).toBe('user_123');
      expect(userCompanies.companies.length).toBe(1);
    });
  });

  // Test Company class
  describe('Company', () => {
    it('should create an instance of Company', () => {
      const company = new Company('1', 'Test Co', 'John', 'Doe', '1990-01-01', '123456789', 'jdoe', 'USA', 'NY', 'password');
      expect(company.id).toBe('1');
      expect(company.name).toBe('Test Co');
    });
  });

  // Test Incident class
  describe('Incident', () => {
    it('should create an instance of Incident', () => {
      const incident = new Incident('1', 'Test Description', 'open', '2024-11-24');
      expect(incident.id).toBe('1');
      expect(incident.description).toBe('Test Description');
    });
  });

  // Test User class
  describe('User', () => {
    it('should create an instance of User', () => {
      const incidents = [new Incident('1', 'Test Incident', 'open', '2024-11-24')];
      const user = new User('1', 'jdoe', 'John', 'Doe', '12345', 'passport', '1990-01-01', '123456789', 10, true, true, false, '2024-01-01', incidents);
      expect(user.id).toBe('1');
      expect(user.username).toBe('jdoe');
      expect(user.incidents.length).toBe(1);
    });
  });

  // Test Plan class
  describe('Plan', () => {
    it('should create an instance of Plan', () => {
      const features = [new Feature('Feature 1'), new Feature('Feature 2')];
      const plan = new Plan('1', 'Basic Plan', 100, features, 'USD');
      expect(plan.id).toBe('1');
      expect(plan.features.length).toBe(2);
    });
  });

  // Test CardInfo class
  describe('CardInfo', () => {
    it('should create an instance of CardInfo', () => {
      const cardInfo = new CardInfo('4111111111111111', '12/24', '123', 'John Doe');
      expect(cardInfo.card_number).toBe('4111111111111111');
      expect(cardInfo.card_holder_name).toBe('John Doe');
    });
  });

  // Test Pay class
  describe('Pay', () => {
    it('should create an instance of Pay', () => {
      const cardInfo = new CardInfo('4111111111111111', '12/24', '123', 'John Doe');
      const pay = new Pay('plan_123', 'company_123', cardInfo);
      expect(pay.plan_id).toBe('plan_123');
      expect(pay.card_info.card_holder_name).toBe('John Doe');
    });
  });

  // Test Subscription class
  describe('Subscription', () => {
    it('should create an instance of Subscription', () => {
      const subscription = new Subscription('sub_123', 'active', 'Success', 'plan_123', 'company_123');
      expect(subscription.status).toBe('active');
    });
  });

  // Test IncidentDetail class
  describe('IncidentDetail', () => {
    it('should create an instance of IncidentDetail', () => {
      const userDetails = new UserDetails('1', 'jdoe', 'John', 'Doe', '12345', 'passport', '1990-01-01', '123456789', 5, true, false, true, '2024-01-01');
      const managerDetails = new ManagerDetails('2', 'manager1', 'Jane', 'Smith');
      const historyItems = [new HistoryItem('Created incident', '2024-11-01')];
      const incidentDetail = new IncidentDetail('1', 'Test Incident', 'open', 'email', 'high', '2024-11-24', 'user_123', userDetails, 'company_123', 'Test Co', 'manager_123', managerDetails, historyItems);

      expect(incidentDetail.user_details.username).toBe('jdoe');
      expect(incidentDetail.history.length).toBe(1);
    });
  });

  // Test PlanList class
  describe('PlanList', () => {
    it('should create an instance of PlanList', () => {
      const plans = [new Plan('1', 'Basic Plan', 100, [new Feature('Feature 1')], 'USD')];
      const planList = new PlanList(plans);
      expect(planList.plans.length).toBe(1);
      expect(planList.plans[0].name).toBe('Basic Plan');
    });
  });

  // Test IncidentList class
  describe('IncidentList', () => {
    it('should create an instance of IncidentList', () => {
      const incidentList = new IncidentList('1', 'Test Description', 'open', 'email', 'high', '2024-11-24', 'user_123', 'company_123', 'Test Co', null);
      expect(incidentList.description).toBe('Test Description');
    });
  });
});
