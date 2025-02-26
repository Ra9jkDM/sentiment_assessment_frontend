import { Component, ViewChild } from '@angular/core';
import { NotificationComponent } from '../../elements/notification/notification.component';
import { AccountService } from '../../server_interaction/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [NotificationComponent],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.sass'
})
export class DeleteAccountComponent {
  @ViewChild(NotificationComponent)
  notification!: NotificationComponent;

  error: Function

  constructor(private router: Router, private account: AccountService) {
    this.error = () => {this.notification.showNotification(undefined, 'Ошибка', 
      'Не удалось удалить аккаунт. Сервер не отвечает', 'confirm')};
  }

  async requestToSaveChanges(){
    this.notification.showNotification(() => {this.saveChanges()}, 'Предупреждение', 'После данного действия аккаунт будет полностью удален и все связанные с ним данные. Подтвердить?');
  }

  async saveChanges() {
    try {
      let req = await this.account.post('user/delete_account', {})
    
      let res = await this.account.isRequestSuccessful(req)
      if (!res) {
        this.error()
      } else {
        this.router.navigate(['/logout']);
      }
    } catch {
      this.error()
    }
  }
}
