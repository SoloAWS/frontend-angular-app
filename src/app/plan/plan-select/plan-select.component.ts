import { Component, OnInit } from '@angular/core';
import { PlanService } from '../plan.service';
import { Plan, PlanList } from '../../models';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormDataService } from '../../form-data.service';

@Component({
  selector: 'app-plan-select',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './plan-select.component.html',
  styleUrl: './plan-select.component.css'
})
export class PlanSelectComponent implements OnInit {
  plans: PlanList | null = null;

  constructor(
    private planService: PlanService,
    private router: Router,
    private formDataService: FormDataService
  ) { }

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans(): void {
    this.planService.getPlans().subscribe(
      (plans: PlanList) => {
        this.plans = plans;
      },
      (error) => {
        console.error('Error fetching plans:', error);
      }
    );
  }

  selectPlan(plan: Plan): void {
    this.formDataService.setFormData({ plan_id: plan.id });
    this.router.navigate(['/plan/pay']);
  }

}
