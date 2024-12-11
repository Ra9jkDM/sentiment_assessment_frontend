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
            await this.request.get('logout');
            this.cookie.delete(this.cookieKey);
            this.router.navigate(['/login'])
        }
    }


    async post(url: string, body: any) {
        let req = await this.request.post(url, body)
        this.isLoginStatus(req);
        return req
    }

    async get(url: string) {
        let req = await this.request.get(url);
        this.isLoginStatus(req);
        return req
    }

    async isLoginStatus(req: any) {
        console.log(req.status)
        if (req.status == 403) {
            await this.logout()
        }
    }

}