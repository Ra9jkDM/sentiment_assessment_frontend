import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
    url: string = 'http://localhost:8000/api/';

    constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
      this.loadConfig()
    }

    loadConfig() {

      console.log(this.document.location.origin)
      fetch(this.document.location.origin+'/assets/config.json').then(r => r.json()).then(r =>
        console.log(r)
        // alert(r.api)
      ).catch()
    }


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