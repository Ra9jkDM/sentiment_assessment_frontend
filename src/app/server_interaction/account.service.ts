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
        await this.request.get('logout');

        this.cookie.set('auth', '', 
            {path: '/', expires:  new Date()});
        this.cookie.delete(this.cookieKey); // Не удаляет после перезагрузки страницы
        this.router.navigate(['/'])
        // if (!this.checkIsLogin()) {
        //     await this.request.get('logout');
        //     this.cookie.delete(this.cookieKey);
        //     this.router.navigate(['/'])
        // }
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
        if (req.status == 403) {
            await this.logout()
        }
    }

    async isRequestSuccessful(request: any) {
        let response = await request.json();
        if (request.status==200 && response.status=='success') {
            return response
        }
        return false
    }

}