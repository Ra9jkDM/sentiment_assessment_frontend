import { NgFor } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InfoComponent } from '../info/info.component';
import { ChangeLoginInfoComponent } from '../change-login-info/change-login-info.component';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';

export interface SettingPage{
  id: string,
  name: string,
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NgbModule, FormsModule, NgFor, InfoComponent, ChangeLoginInfoComponent, DeleteAccountComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent {
  @ViewChildren('menu') menu!: QueryList<ElementRef<HTMLDivElement>>;

  pages: Array<SettingPage> = Array(
    {id: "info", name: "Общие"},
    {id: 'login', name: "Изменение учетных данных"},
    {id: 'delete', name: "Удаление аккауна"}
  )

  radio: string = this.pages[0].id;

  checkValue() {
    for (let i of this.menu) {
      if (i.nativeElement.id == this.radio) {
        this.unhide(i);
      } else {
        this.hide(i);
      }
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
