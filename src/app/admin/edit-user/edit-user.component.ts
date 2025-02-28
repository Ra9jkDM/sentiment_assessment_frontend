import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.sass'
})
export class EditUserComponent {

  component_cls: string = 'hide'

  hide() {
    this.component_cls = 'hide'
  }
  unhide() {
    this.component_cls = 'none'
  }

  changePasswordVisibility() {

  }
}
