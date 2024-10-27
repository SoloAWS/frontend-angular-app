import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Pay, PlanList } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPlans(): Observable<PlanList> {
    return this.http.get<PlanList>(
      `${this.apiUrl}/billing-manager/plans`
    );
  }

  assignPlan(pay: Pay): Observable<Subscription> {
    return this.http.post<Subscription>(
      `${this.apiUrl}/billing-manager/assign-plan`,
      pay
    );
  }
}
