import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Feature, Pay, Plan, PlanList } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPlans(): Observable<PlanList> {
    /*return this.http.get<PlanList>(
      `${this.apiUrl}/billing-management/plans`
    );*/
    const burnedPlanList = new PlanList([
      new Plan(
        "67c52598-c06c-4e38-a5a3-d7c647cfa0dc",
        "Emprendedor",
        99,
        [
          new Feature("Registro de PQRs"),
          new Feature("Atención telefónica"),
          new Feature("Escalamiento automatizado"),
          new Feature("Reportes básicos")
        ],
        "USD"
      ),
      new Plan(
        "2e3f1f37-3048-4c71-a28f-b8e8c1332c4e",
        "Empresario",
        199,
        [
          new Feature("Todo de Emprendedor"),
          new Feature("Soporte multicanal"),
          new Feature("Llamadas salientes"),
          new Feature("Panel de control avanzado")
        ],
        "USD"
      ),
      new Plan(
        "9d3f6f4b-6d9a-4f1f-9c9f-1c9f1c9f1c9f",
        "Empresario Plus",
        299,
        [
          new Feature("Todas de Empresario"),
          new Feature("Análisis con IA"),
          new Feature("Modelos predictivos"),
          new Feature("Soporte con IA generativa")
        ],
        "USD"
      )
    ]);
    return of(burnedPlanList);
  }

  assignPlan(pay: Pay): Observable<any> {
    /*return this.http.post<any>(
      `${this.apiUrl}/billing-management/plans`,
      pay
    );*/
    const mockResponse = {
      subscription_id: '53027754-d0c5-4dc7-80f6-6b4fb1ad87b9',
      status: 'active',
      message: 'Subscription created successfully',
      plan_id: '67c52598-c06c-4e38-a5a3-d7c647cfa0dc',
      company_id: '7f8d35a9-25c4-4aeb-89b2-9f24be9d3634',
    };
    return of(mockResponse);
  }
}
