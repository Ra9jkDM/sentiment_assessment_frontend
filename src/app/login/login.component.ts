import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../server_interaction/account.service';
import { RequestService } from '../server_interaction/request.service';
import { FormsModule } from '@angular/forms';

export interface User {
  username?: string;
  password?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  user: User = {};
  info: string = '';

  constructor(private router: Router, private request: RequestService,
    private cookie: CookieService, private account: AccountService) {
      account.isLogin();
      if (this.cookie.get('auth')) {
        this.router.navigate(['/account']);
      }
  }

  async login() {
    let req = await this.request.post('login', {
          "username": this.user.username,
          "password": this.user.password
        })

        let res = await this.account.isRequestSuccessful(req)
    if (res) {
      this.cookie.set('auth', res.cookie, 
        {path: '/', expires:  this.addDays(new Date(), 10)});
        this.cookie.set('role', res.role, 
          {path: '/', expires:  this.addDays(new Date(), 10)});
      // this.router.navigate(['/account']); #ml_check
      this.router.navigate(['/ml_check']); 
    } else {
      this.info='Неправильный логин или пароль.';
    }

  }

  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

}
