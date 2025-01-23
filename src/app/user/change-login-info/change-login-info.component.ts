import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../server_interaction/account.service';

@Component({
  selector: 'app-change-login-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-login-info.component.html',
  styleUrl: './change-login-info.component.sass'
})
export class ChangeLoginInfoComponent {
  username: string = ''

constructor(private account: AccountService) {
    
}

async ngOnInit() {
  await this.loadData()
}

async loadData() {
  let req = await this.account.get('user');

  let jsonObj = await req.json();

  this.username = jsonObj.username;

}


}
