import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccountService } from '../../server_interaction/account.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../notification/notification.component';
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

  constructor(private account: AccountService, private app: AppComponent,
    private imageService: ImageService
  ) {
    this.error = () => {this.notification.showNotification(undefined, 'Ошибка', 
      'Не удалось сохранить внесенные изменеия', 'confirm')};
    
  }

  async ngOnInit() {
    await this.loadData()
  }

  async loadData() {
    let req = await this.account.get('user');
    // let req_img = await this.account.get_file('user/avatar');

    let jsonObj = await req.json();
    // console.log(jsonObj)
    this.username = jsonObj.username
    this.name = jsonObj.firstname;
    this.lastname = jsonObj.lastname;


    if (jsonObj.role == 'admin') {
      this.role = 'Администратор'
    }

    
    // let blob = await req_img.blob() as Blob
    //   // console.log(blob.type)
    // if (blob.type == 'image/img') {
    //     // let reader = new FileReader()
    //     // reader.onload = (e: any) => {
    //     //   this.img.nativeElement.src = e.target.result;
    //     // };
    //     // reader.readAsDataURL(blob);
    //   this.loadImage(this.img, blob)
    // }

    this.imageService.loadImageIfExists('user/avatar', this.img)
    
  }

  changeImage() {
    // console.info('Image:', this.file.nativeElement.files);
    if (this.file.nativeElement.files && this.file.nativeElement.files[0]) {
      this.avatar = this.file.nativeElement.files[0];
      this.imageService.loadImage(this.img, this.avatar)
     
      // let reader = new FileReader()

      // reader.onload = (e: any) => {
      //   // console.info(e.target.result);
      //   this.img.nativeElement.src = e.target.result;
      // };

      // // console.info(this.file.nativeElement.files[0]);
      // reader.readAsDataURL(this.file.nativeElement.files[0]);
      // this.avatar = this.file.nativeElement.files[0];
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

        let req_img
      if (this.avatar) {
        let body = {photo: this.avatar}
        req_img = await this.account.post_file('user/avatar/update', body)
      }
    
      let res = await this.account.isRequestSuccessful(req)
      req_img = await this.account.isRequestSuccessful(req_img)

      if (!res || !req_img) {
        this.error()
      }   

      
    // if (this.file.nativeElement.files && this.file.nativeElement.files[0]) {
    //   let reader = new FileReader()

    //   reader.onload = (e: any) => {
    //     // console.info(e.target.result);
    //     this.app.img.nativeElement.src = e.target.result;
    //   };

    //   // console.info(this.file.nativeElement.files[0]);
    //   reader.readAsDataURL(this.file.nativeElement.files[0]);
    //   this.avatar = this.file.nativeElement.files[0];
    // }

    if (this.avatar) {
      this.imageService.loadImage(this.app.img, this.avatar)
    }


     ////
    } catch {
      this.error()
    }
  }
}
