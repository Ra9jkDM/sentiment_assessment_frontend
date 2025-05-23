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

    getBaseUrl() {
        return this.request.url
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
    
    isAdmin() { 
        if (this.getRole() == 'admin') {
            return true
        }
        return false
    }

    checkPrivileges(role: string) {
        if (this.getRole() != role) {
            this.router.navigate(['/'])
        }
    }

    getRole() {
        return this.cookie.get('role')
    }


    async logout() {
        await this.request.get('logout');

        this.cookie.set('auth', '', 
            {path: '/', expires:  new Date()});
        this.cookie.set('role', '', 
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

    async post_file(url: string, body: any) {
        let req = await this.request.post_file(url, body)
        this.isLoginStatus(req);
        return req
    }

    async get(url: string) {
        let req = await this.request.get(url);
        this.isLoginStatus(req);
        return req
    }

    async get_file(url: string) {
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