import { NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InfoComponent } from '../info/info.component';
import { ChangeLoginInfoComponent } from '../change-login-info/change-login-info.component';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';

export interface SettingPage{
  name: string,
  route: string, //Del
  page: any
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NgbModule, FormsModule, NgFor, InfoComponent, ChangeLoginInfoComponent, DeleteAccountComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent {
  @ViewChild('main') page!: ElementRef<HTMLDivElement>;
  @ViewChild('first') f!: ElementRef;
  @ViewChild('second') s!: ElementRef;

  pages: Array<SettingPage> = Array(
    { name: "Общие", route: "/account", page: InfoComponent},
    {name: "Изменение учетных данных", route: '/account/access', page: ChangeLoginInfoComponent},
    {name: "Удаление аккауна", route: '/account/delete', page: DeleteAccountComponent}
  )

  model: string = this.pages[0].route;
  visible: string = 'none';

  constructor() {
    // this.page.nativeElement.innerHTML = this.pages[0].page();
  }

  checkValue() {
    console.info(typeof(this.s.nativeElement));
    if (this.model == '/account') {
      this.hide(this.s);
      this.unhide(this.f)
    } else {
      this.unhide(this.s);
      this.hide(this.f)
    }
  }
  
  hide(el: ElementRef){
    el.nativeElement.classList.value = '';
    el.nativeElement.classList.add('hide');
  }

  unhide(el: ElementRef){
    el.nativeElement.classList.value = '';
    el.nativeElement.classList.remove('hide');
  }

}
