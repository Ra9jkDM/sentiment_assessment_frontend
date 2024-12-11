import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccountService } from '../../server_interaction/account.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.sass'
})
export class InfoComponent {
  @ViewChild('img') img!:  ElementRef<HTMLImageElement>;
  @ViewChild('file') file!:  ElementRef<HTMLInputElement>;
  @ViewChild('name') name!: ElementRef<HTMLInputElement>;
  @ViewChild('lastname') lastname!: ElementRef<HTMLInputElement>;

  constructor(private account: AccountService) {
    
  }

  async ngOnInit() {
    await this.loadData()
  }

  async loadData() {
    let req = await this.account.get('user');

    let jsonObj = await req.json();

    this.name.nativeElement.value = jsonObj.firstname;
    this.lastname.nativeElement.value = jsonObj.lastname;

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
    
  }
}
