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

  name :string = '';
  lastname: string = '';

  constructor(private account: AccountService) {
    
  }

  async ngOnInit() {
    await this.loadData()
  }

  async loadData() {
    let req = await this.account.get('user');

    let jsonObj = await req.json();

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

  async saveChanges() {
    // ToDo
    console.log(this.name, this.lastname);
    // this.notification.showNotification();
  }
}
