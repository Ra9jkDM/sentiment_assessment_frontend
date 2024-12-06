import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
    loginPage: string = 'login';
    cookieKey: string = 'auth'

    constructor(private router: Router, private cookie: CookieService,
        private request: RequestService
    ) {

    }

    isLogin() {
        if (!this.cookie.get(this.cookieKey)) {
            this.router.navigate([this.loginPage])
        }
    }

    checkIsLogin() {
        if (!this.cookie.get(this.cookieKey)) {
            return true;
        }
        return false;
    }
    
    async logout() {
        if (!this.checkIsLogin()) {
            await this.request.logout()
            this.cookie.delete(this.cookieKey);
        }
    }
}