import { TestBed } from '@angular/core/testing';

import { PlanService } from './plan.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PlanService', () => {
  let service: PlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
