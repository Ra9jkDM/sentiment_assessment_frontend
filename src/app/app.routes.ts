import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MlCheckComponent } from './ml-check/ml-check.component';
import { InspectionResultsComponent } from './inspection-results/inspection-results.component';
import { RegistrationComponent } from './registration/registration.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './user/account/account.component';
import { InfoComponent } from './user/info/info.component';
import { ChangeLoginInfoComponent } from './user/change-login-info/change-login-info.component';
import { DeleteAccountComponent } from './user/delete-account/delete-account.component';
import { LogoutComponent } from './logout/logout.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AboutComponent } from './about/about.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { TestDataComponent } from './test-data/test-data.component';

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'ml_check', component: MlCheckComponent},
    {path: 'inspection_results', component: InspectionResultsComponent},
    {path: 'registration', component: RegistrationComponent},

    // User
    {path: 'account', component: AccountComponent},
    {path: 'admin', component: AdminPanelComponent},

    {path: 'about', component: AboutComponent},
    {path: 'terms-of-use', component: TermsOfUseComponent},

    // Test data
    {path: 'test', component: TestDataComponent},

    {path: '**', pathMatch: 'full', component: PageNotFoundComponent}
];
