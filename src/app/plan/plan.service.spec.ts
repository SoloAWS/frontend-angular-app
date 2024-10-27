import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlanService } from './plan.service';
import { environment } from '../../environments/environment';
import { Pay, PlanList, Subscription } from '../models';

describe('PlanService', () => {
  let service: PlanService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PlanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch plans', () => {
    const mockPlans: PlanList = { plans: [{ id: '1', name: 'Basic', price: 10, features: [], currency: 'USD' }] };

    service.getPlans().subscribe((plans) => {
      expect(plans).toEqual(mockPlans);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/billing-manager/plans`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlans);
  });

  it('should assign a plan', () => {
    const mockPay: Pay = new Pay('1', '1', { card_number: '1234567812345678', expiration_date: '12/23', cvv: '123', card_holder_name: 'John Doe' });
    const mockResponse: Subscription = new Subscription('123', 'SUCCESS', 'Payment Successful', '1', '1');

    service.assignPlan(mockPay).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/billing-manager/assign-plan`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPay);
    req.flush(mockResponse);
  });
});
