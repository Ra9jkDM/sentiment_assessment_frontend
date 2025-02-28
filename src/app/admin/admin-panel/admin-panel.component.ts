import { NgFor, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AccountService } from '../../server_interaction/account.service';
import { UserRowComponent } from '../user-row/user-row.component';

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
  imports: [NgFor, NgIf, EditUserComponent, UserRowComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.sass'
})
export class AdminPanelComponent {
  @ViewChild(EditUserComponent)
  edit_user!: EditUserComponent;

  users: User[] = [{
    username: "213@s.co", password: '****', firstname: 'Bob', lastname: 'NaBob', is_active: true, role: 'User'
  },
  {  username: "bob@s.co", password: '****', firstname: 'Bob1', lastname: 'NaBob', is_active: false, role: 'User'
  },
  {  username: "ann@s.co", password: '****', firstname: 'Bob1', lastname: 'NaBob', is_active: true, role: 'User'
  }
]

  constructor(private account: AccountService) {
    account.isLogin()
    account.checkPrivileges('admin')
  }

  async ngAfterViewInit() {

  }

  editUser() {
    this.edit_user.unhide()
  }
}
