import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { IncidentCreateComponent } from './incident/incident-create/incident-create.component';
import { DashboardComponent } from './incident/dashboard/dashboard.component';
import { IncidentDetailComponent } from './incident/incident-detail/incident-detail.component';
import { PlanInitComponent } from './plan/plan-init/plan-init.component';
import { PlanSelectComponent } from './plan/plan-select/plan-select.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'incident/dashboard', component: DashboardComponent },
    { path: 'incident/create', component: IncidentCreateComponent },
    { path: 'incident/details', component: IncidentDetailComponent },
    { path: 'plan/init', component: PlanInitComponent },
    { path: 'plan/select', component: PlanSelectComponent }
];
