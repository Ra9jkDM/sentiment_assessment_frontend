import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../server_interaction/account.service';
import { RequestService } from '../server_interaction/request.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  @ViewChild('username') username!: ElementRef<HTMLInputElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  @ViewChild('info') info!: ElementRef<HTMLParagraphElement>;

  constructor(private router: Router, private request: RequestService,
    private cookie: CookieService, private account: AccountService) {
      account.isLogin();
      if (this.cookie.get('auth')) {
        this.router.navigate(['/account']);
      }
  }

  async login() {
    let req = await this.request.post('login', {
          "username": this.username.nativeElement.value,
          "password": this.password.nativeElement.value
        })

    let response = await req.json();
    if (req.status==200 && response.status=='success') {
      this.cookie.set('auth', response.cookie);
      this.router.navigate(['/account']);
    } else {
      this.info.nativeElement.textContent='Неправильный логин или пароль.';
    }

  }

}
