import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccountService } from '../../server_interaction/account.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [FormsModule, NotificationComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.sass'
})
export class InfoComponent {
  @ViewChild(NotificationComponent)
  notification!: NotificationComponent;

  @ViewChild('img') img!:  ElementRef<HTMLImageElement>;
  @ViewChild('file') file!:  ElementRef<HTMLInputElement>;

  username: string = '';
  name :string = '';
  lastname: string = '';
  error: Function;

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
    // console.log(jsonObj)
    this.username = jsonObj.username
    this.name = jsonObj.firstname;
    this.lastname = jsonObj.lastname;

  }

  changeImage() {
    // console.info('Image:', this.file.nativeElement.files);
    if (this.file.nativeElement.files && this.file.nativeElement.files[0]) {
      let reader = new FileReader()

      reader.onload = (e: any) => {
        // console.info(e.target.result);
        this.img.nativeElement.src = e.target.result;
      };

      // console.info(this.file.nativeElement.files[0]);
      reader.readAsDataURL(this.file.nativeElement.files[0]);

    }

  }

  async requestToSaveChanges() {
    this.notification.showNotification(() => {this.saveChanges()}, 'Предупреждение', 'Сохранить внесенные изменения?');
  }

  async saveChanges() {
    try {
      let req = await this.account.post('user/update', 
        {'username': this.username, 
          "firstname": this.name,
          "lastname": this.lastname})
    
      let res = await this.account.isRequestSuccessful(req)
      if (!res) {
        this.error()
      }
    } catch {
      this.error()
    }
  }

}
