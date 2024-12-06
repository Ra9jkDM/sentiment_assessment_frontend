import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
    url: string = 'http://localhost:8000/';

    async logout() {
        let req = await fetch(this.url+'logout', {credentials: 'include'})
    }

    // {
    //     let req = await fetch('http://localhost:8000/login', {
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         method: "POST",
    //         body: JSON.stringify({
    //           "username": this.username.nativeElement.value,
    //           "password": this.password.nativeElement.value
    //         }),
    //         credentials: 'include'
    //       })
    // }
}