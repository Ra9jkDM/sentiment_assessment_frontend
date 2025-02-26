import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.sass'
})
export class NotificationComponent {
  @Input() info: string = ""
  @Input() status: string = ""
  notification: string = "none"
  btn_status: string = ''
  btn_ok_status: string = 'none'

  action?: Function;

  hide() {
    this.hideNotification()
  }

  public showNotification(callback?: Function, status: string = 'Ошибка', info: string = 'Ошибка сервера', dialog_status='save') {
    /**
     * @param dialog_status - state: save - 2 buttons (confirm/deny), confirm - 1 button - ok
     */
    this.action = callback
    this.status = status
    this.info = info

    if (dialog_status == 'confirm') {
      this.btn_status = 'none'
      this.btn_ok_status = 'block'
    } else {
      this.btn_status = 'block'
      this.btn_ok_status = 'none'
    }

    this.notification = "block"
  }
  public hideNotification() {
    this.notification = "none"
  }

  confirmAction() {
    if (this.action) {
      this.action()
    }
  }
}
