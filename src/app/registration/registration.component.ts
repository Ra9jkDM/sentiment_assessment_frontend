import { Component, ElementRef, Input, NgModule, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RequestService } from '../server_interaction/request.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface User{
  name?: string, 
  surname?: string,
  mail?: string,
  password?: string,
  password_check?: string
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.sass'
})
export class RegistrationComponent {
   user: User = {};
  @ViewChild('terms') terms!: ElementRef<HTMLInputElement>;
  error: string = '';

  constructor(private request: RequestService, private router: Router) {

  }

  async register() {
    if (this.terms.nativeElement.checked &&
      this.user.password == this.user.password_check && 
      this.user.password && this.user.password?.length >= 8
    ) {
      let req = await this.request.post('registration', {
        "username": this.user.mail,
        "firstname": this.user.name,
        "lastname": this.user.surname,
        "password": this.user.password,
        "is_active": true
    })
    let result = await req.json();

    if (result.status == 'success') {
      this.router.navigate(['/login'])
    } else {
      this.errorMessage('Не удалось зарегистрироваться с текущими данными.');
    }
  } else {
    this.errorMessage('Форма для регистрации заполнена не верно.')
  }
  }

  errorMessage(msg: string) {
    this.error = msg;
  }
}
