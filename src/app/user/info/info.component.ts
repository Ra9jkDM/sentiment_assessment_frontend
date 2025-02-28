import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccountService } from '../../server_interaction/account.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../elements/notification/notification.component';
import { AppComponent } from '../../app.component';
import { ImageService } from '../../server_interaction/image.service';

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
  name: string = '';
  lastname: string = '';
  role: string = 'Пользователь';
  error: Function;
  avatar?: File;
  isImageDeleted: boolean = false

  baseImage: string = '/assets/user-logo.png'

  constructor(private account: AccountService, private app: AppComponent,
    private imageService: ImageService
  ) {
    this.error = () => {this.notification.showNotification(undefined, 'Ошибка', 
      'Не удалось сохранить внесенные изменеия', 'confirm')};
    
  }

  async ngAfterViewInit() {
    await this.loadData()
  }

  async loadData() {
    let req = await this.account.get('user');

    let jsonObj = await req.json();
    this.username = jsonObj.username
    this.name = jsonObj.firstname;
    this.lastname = jsonObj.lastname;


    if (jsonObj.role == 'admin') {
      this.role = 'Администратор'
    }

    this.imageService.loadImageIfExists('user/avatar', this.img)
    
  }

  changeImage() {
    if (this.file.nativeElement.files && this.file.nativeElement.files[0]) {
      this.avatar = this.file.nativeElement.files[0];
      this.imageService.loadImage(this.img, this.avatar)
      this.isImageDeleted = false
    }

  }

  deleteImage() {
    this.img.nativeElement.src = this.baseImage;
    this.isImageDeleted = true
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

      let req_img
      if (this.isImageDeleted) {
        req_img = await this.account.post('user/avatar/delete', {})
      } else if (this.avatar) {
        let body = {photo: this.avatar}
        req_img = await this.account.post_file('user/avatar/update', body)
      }
    
      let res = await this.account.isRequestSuccessful(req)

      if (this.avatar) {
        req_img = await this.account.isRequestSuccessful(req_img)
      } else {
        req_img = true
      }

      if (!res || !req_img) {
        this.error()
      }   

    if (this.isImageDeleted){
      this.app.img.nativeElement.src = this.baseImage;
    } else if (this.avatar) {
      this.imageService.loadImage(this.app.img, this.avatar)
    }

    } catch {
      this.error()
    }
  }
}
