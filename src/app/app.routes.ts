import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MlCheckComponent } from './ml-check/ml-check.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'ml_check', component: MlCheckComponent}
];
