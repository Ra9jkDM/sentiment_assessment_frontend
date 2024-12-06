import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {

  constructor(private router: Router, private http: HttpClient,
    private cookie: CookieService
  ) {

  }

  async login() {
    let res = await fetch('http://localhost:8000/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        "username": "tom@mail.ts",
        "password": "secret001"
      }),
      credentials: 'include'
    })

    let js_obj = await res.json();
    // res.json().then(x=> {console.log(x);});
    console.log(res, js_obj, js_obj.cookie)

    this.cookie.set('auth', js_obj.cookie)
    

    res = await fetch('http://localhost:8000/user', {
      // headers: {
      //   Cookie: this.cookie.get('auth')
      // },
      credentials: 'include'
    })
    console.log(res, await res.json())

    // this.router.navigate(['/account']);
  }

}
