import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { IncidentCreateComponent } from './incident/incident-create/incident-create.component';
import { DashboardComponent } from './incident/dashboard/dashboard.component';
import { DashboardManagerComponent } from './incident/dashboard-manager/dashboard-manager.component';
import { IncidentDetailComponent } from './incident/incident-detail/incident-detail.component';
import { PlanInitComponent } from './plan/plan-init/plan-init.component';
import { PlanSelectComponent } from './plan/plan-select/plan-select.component';
import { PlanPayComponent } from './plan/plan-pay/plan-pay.component';
import { IncidentListComponent } from './incident/incident-list/incident-list.component';
import { IncidentGetComponent } from './incident/incident-get/incident-get.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'incident/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['company'] }
  },
  {
    path: 'incident/dashboard-manager',
    component: DashboardManagerComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['manager'] }
  },
  {
    path: 'incident/create',
    component: IncidentCreateComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['manager'] }
  },
  {
    path: 'incident/details',
    component: IncidentDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['manager'] }
  },
  {
    path: 'incident/list',
    component: IncidentListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['manager'] }
  },
  {
    path: 'incident/:id',
    component: IncidentGetComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['manager'] }
  },
  {
    path: 'plan/init',
    component: PlanInitComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['company'] }
  },
  {
    path: 'plan/select',
    component: PlanSelectComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['company'] }
  },
  {
    path: 'plan/pay',
    component: PlanPayComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['company'] }
  }
];
