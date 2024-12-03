import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MlCheckComponent } from './ml-check/ml-check.component';
import { InspectionResultsComponent } from './inspection-results/inspection-results.component';
import { RegistrationComponent } from './registration/registration.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'login', component: LoginComponent},
    {path: 'ml_check', component: MlCheckComponent},
    {path: 'inspection_results', component: InspectionResultsComponent},
    {path: 'registration', component: RegistrationComponent},

    {path: '**', pathMatch: 'full', component: PageNotFoundComponent}
];
