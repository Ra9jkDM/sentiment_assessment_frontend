import { Component } from '@angular/core';

export interface User {
  name: string
}

@Component({
  selector: 'app-user-row',
  standalone: true,
  imports: [],
  templateUrl: './user-row.component.html',
  styleUrl: './user-row.component.sass'
})
export class UserRowComponent {
  user: User = {name: '123'}
}
