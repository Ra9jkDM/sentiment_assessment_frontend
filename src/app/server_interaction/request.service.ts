import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class RequestService {
    url: string = 'https://sentiment-analysis.mooo.com/api/'; //'http://localhost:8000/api/';  

    constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
      this.loadConfig()
    }

    async loadConfig() {

      // let a = await this.http.get<AppConfig>('/assets/config.json').pipe(tap((response: AppConfig) => {
      //   this.url = response.api;
      // }));
      // console.log(this.url);

      // this.http.get<AppConfig>('/assets/config.json').pipe(tap((response: AppConfig) => {
      //   this.url = response.api;
      //   console.log(this.url);
      // })).subscribe();

      // console.log(this.url);
      // console.log(this.document.location.origin)
      // Вызывает ошибку при сборке проекта: fetch faild
      // Возможно при сборке, сборщик хочет закешировать ответ т.к. запрашиваем локальный config
      // fetch(this.document.location.origin+'/assets/config.json').then(r => r.json()).then(r =>
      //   // console.log(r)
      //   this.url = r.api
      // ).catch()

    }

    async post(url: string, body: any) {
      let req = await fetch(this.url + url, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(body),
        credentials: 'include'
      })
      return req
    }

    async get(url: string) {
      let req = await fetch(this.url + url, {
        credentials: 'include'
      });
      return req
    }
}