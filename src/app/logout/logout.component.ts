import { Component } from '@angular/core';
import { AccountService } from '../server_interaction/account.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.sass'
})
export class LogoutComponent {
  constructor(private account: AccountService) {
    
  }

  async ngOnInit() {
    await this.account.logout();
    this.account.isLogin();
  }
}
