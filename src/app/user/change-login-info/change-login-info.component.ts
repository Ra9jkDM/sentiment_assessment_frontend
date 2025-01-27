import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../server_interaction/account.service';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-change-login-info',
  standalone: true,
  imports: [FormsModule, NotificationComponent],
  templateUrl: './change-login-info.component.html',
  styleUrl: './change-login-info.component.sass'
})
export class ChangeLoginInfoComponent {
  @ViewChild(NotificationComponent)
  notification!: NotificationComponent;
  info: string = ''

  username: string = ''
  password: string = ''
  repeated_password: string = ''

  error: Function

constructor(private account: AccountService) {
  this.error = () => {this.notification.showNotification(undefined, 'Ошибка', 
    'Не удалось сохранить внесенные изменеия', 'confirm')};
}

async ngOnInit() {
  await this.loadData()
}

async loadData() {
  let req = await this.account.get('user');

  let jsonObj = await req.json();

  this.username = jsonObj.username;

}

async requestToSaveChanges(){
  if (this.password == '') {
    this.info = 'Некорректный пароль'
  } else if (this.password.length < 8) {
    this.info = 'Пароль должен быть более 8 символов'
  } else if (this.password != this.repeated_password) {
    this.info = 'Пароли не совпадают'
  } else {
    this.info = ''
    this.notification.showNotification(() => {this.saveChanges()}, 'Предупреждение', 'Сохранить внесенные изменения?');
  }
}

async saveChanges() {
    try {
      let req = await this.account.post('user/change_password', 
        {'password': this.password})
    
      let res = await this.account.isRequestSuccessful(req)
      if (!res) {
        this.error()
      }
    } catch {
      this.error()
    }
}

}
