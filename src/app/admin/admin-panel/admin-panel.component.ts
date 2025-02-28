import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AccountService } from '../../server_interaction/account.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../elements/notification/notification.component';

export interface User{
  username: string
  password: string

  firstname: string
  lastname: string
  is_active: boolean
  role: string
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, EditUserComponent, NotificationComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.sass'
})
export class AdminPanelComponent {
  @ViewChild(NotificationComponent)
  notification!: NotificationComponent;
  
  @ViewChild(EditUserComponent)
  edit_user!: EditUserComponent;
  @ViewChild('page_numbers') page_numbers!: ElementRef<HTMLUListElement>
 
  RECORDS_ON_PAGE: number = 10
  max_page_idx: number = 1

  user_name: string = ''
  current_page: number = 1

  pages: Array<number>= [1]

  users: any[] = []

  constructor(private account: AccountService) {
    account.isLogin()
    account.checkPrivileges('admin')
  }

  async ngAfterViewInit() {
    await this.loadData()
  }

  async loadData() {
    let req = await this.account.get(this.createRequestUrl('users/length'))
    let jsonObj = await req.json();
    console.log('LoadData', jsonObj)
  
    let page_len = this.countPageLen(jsonObj)
    this.max_page_idx = page_len
  
    
    console.log('pages', this.pages)
    this.pages = [1]
    for(let i = 1; i < page_len; i++) {
      this.pages.push(i+1)
    }
    console.log('pages', this.pages)
  
    await this.changePage(1)
  }

  private async loadRecords(page: number) {
    let req = await this.account.get(this.createRequestUrl('users'))
    let jsonObj = await req.json();
    console.log(jsonObj)
  
    this.users = Array()

    for (let i in jsonObj) {
      this.users.push(jsonObj[i])
    }

  }

  createRequestUrl(start: string) {
    let result = 'admin/'+ start + '?page=' + this.current_page

    if (this.user_name) {
      result += '&name=' + this.user_name
    }

    return result
  }

  private countPageLen(pages: number) {
    let remainder = pages % this.RECORDS_ON_PAGE
    let page_len = (pages - remainder) / this.RECORDS_ON_PAGE
    if (remainder > 0) {
      page_len += 1
    }
  
    return page_len
  }

  async changePage(page: number) {
    console.log(this.page_numbers)
    console.log(this.page_numbers.nativeElement.children)
  
    this.current_page = page
    if (this.current_page < 1) {
      this.current_page = 1
    } else if (this.current_page > this.max_page_idx) {
      this.current_page = this.max_page_idx
    }
  
    await this.loadRecords(this.current_page)
    this.updateCurrentPageId()
    }
  
    updateCurrentPageId() {
    console.log(this.current_page)
    for(let i = 0; i < this.page_numbers.nativeElement.children.length - 1; i++) {
      this.page_numbers.nativeElement.children[i].classList.remove('current-page')
    }
  
    this.page_numbers.nativeElement.children[this.current_page].classList.add('current-page')
  
    }
  
    async nextPage() {
    this.current_page += 1
    this.changePage(this.current_page)
    }
  
    async previousPage() {
    this.current_page -= 1
    this.changePage(this.current_page)
    }

  editUser(user: any) {
    this.edit_user.unhide(user)
  }

  async activateUser(event: any, user: any) {
    console.log(event)
    let btn = event.srcElement // originalTarget

    let is_active = true

    if (btn.value == 'false') {
      is_active = false
    }

    let req = await this.account.post('admin/users/activate', {'user': user.username, 'is_active': !is_active})
    let res = await this.account.isRequestSuccessful(req)

    if(!res) {
      this.notification.showNotification(() => {}, 'Ошибка', 'Не удалось сохранить внесенные изменеия', 'confirm');
    }
    
    btn.classList.remove('btn-outline-warning')
    btn.classList.remove('btn-warning')

    console.log(btn.value)
    if (is_active) {
      btn.value = false
      btn.textContent = 'Отключен'
      btn.classList.add('btn-warning')
    } else {
      btn.value = true
      btn.textContent = 'Активен'
      btn.classList.add('btn-outline-warning')
    }
    
  }
  async deteteUser(user: any) {
    this.notification.showNotification(() => {this._deleteUser(user)}, 'Предупреждение', 'Удалить пользователя '+user.username+'?', 'save');
  }

  async _deleteUser(user: any) {
    let req = await this.account.post('admin/users/delete', {'user': user.username})
    let res = await this.account.isRequestSuccessful(req)

    if(!res) {
      this.notification.showNotification(() => {}, 'Ошибка', 'Не удалось удалить пользователя '+user.username, 'confirm');
    }

    this.users = this.users.filter(obj => { return obj.username !== user.username})
  }
}
