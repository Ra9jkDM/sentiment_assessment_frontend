import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AccountService } from '../../server_interaction/account.service';
import { NotificationComponent } from '../../elements/notification/notification.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.sass'
})
export class EditUserComponent {
  @ViewChild('password') password!: ElementRef<HTMLInputElement>
  @Input() notification!: NotificationComponent

  user: any = {}
  user_copy: any = {}
  role: string = 'user'

  component_cls: string = 'hide'

  constructor(private account: AccountService) {

  }

  hide() {
    this.component_cls = 'hide'
  }
  unhide(user: any) {
    this.user = user
    this.user_copy = this.clone(user)

    this.component_cls = 'none'
  }

  clone(obj: any) {
    return JSON.parse(JSON.stringify(obj))
  }

  changePasswordVisibility() {
    if (this.password.nativeElement.type == 'password') {
      this.password.nativeElement.type='text'
    } else {
       this.password.nativeElement.type='password'
    }
  }

  async saveChanges() {
    console.log(this.user)
    let req = await this.account.post('admin/users/update', this.user)
    let res = await this.account.isRequestSuccessful(req)

    if(!res) {
      this.cancel()
      this.notification.showNotification(() => {}, 'Ошибка', 'Не удалось сохранить изменения для пользователя '+this.user.username, 'confirm');
    }

    this.hide()

  }

  cancelAction() {
    this.cancel()
    this.hide()
  }

  cancel() {
    this.user.firstname = this.user_copy.firstname
    this.user.lastname = this.user_copy.lastname
    this.user.password = this.user_copy.password
    this.user.role = this.user_copy.role

  }
}
