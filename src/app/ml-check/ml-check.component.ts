import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../server_interaction/account.service';
import { CircleStatusComponent } from '../elements/circle-status/circle-status.component';
import { tree } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-ml-check',
  standalone: true,
  imports: [RouterLink, CircleStatusComponent],
  templateUrl: './ml-check.component.html',
  styleUrl: './ml-check.component.sass'
})
export class MlCheckComponent{
  @ViewChild('checkButton') btn!: ElementRef;
  @ViewChild('file') file!: ElementRef<HTMLInputElement>
  @ViewChild('text') text!: ElementRef<HTMLTextAreaElement>

  @ViewChild('load') load!: ElementRef;
  @ViewChild('result') result!: ElementRef;
  @ViewChild('sentiment') sentiment!: ElementRef<HTMLSpanElement>;

  @ViewChild(CircleStatusComponent) status_circle!: CircleStatusComponent

  @ViewChild('error') error!: ElementRef<HTMLParagraphElement>; 

  status: string = 'hide'
  
  constructor(private account: AccountService) {
    account.isLogin();
  }
  
  async checkText() {
    this.hide(this.btn);
    this.hide(this.result);
    this.hide(this.error)
    this.status = 'hide'

    this.unhide(this.load);

    let req = await this.account.post('ml/lstm', {'text': this.text.nativeElement.value});
    let result = await req.json()

    this.sentiment.nativeElement.classList.value = '';

    if (result.positive) {
      this.sentiment.nativeElement.classList.add('text-success');
      this.sentiment.nativeElement.innerText = 'Положительная';
    } else if (result.negative) {
      this.sentiment.nativeElement.classList.add('text-danger');
      this.sentiment.nativeElement.innerText = 'Отрицательная';
    } else {
      this.sentiment.nativeElement.classList.add('text-primary');
      this.sentiment.nativeElement.innerText = 'Нейтральная';
    }

    this.hide(this.load);
    this.unhide(this.btn);
    this.unhide(this.result);
  }

  async checkTable() {
    this.hide(this.result);
    this.status = 'hide'

    this.unhide(this.load);
    if (this.file.nativeElement.files && this.file.nativeElement.files[0]) {
      let file = this.file.nativeElement.files[0]
      console.log(file)
      if (this.checkExtension(file.name)) {
        console.log('Supported type')
        this.hide(this.error)
        let req_table = await this.account.post_file('ml/lstm/table', {'file': file})
        let res = await this.account.isRequestSuccessful(req_table)
        // console.log(res)
        this.hide(this.load);
        if (!res) {
          this.error.nativeElement.textContent = 'Ошибка: некорректный файл'
          this.unhide(this.error)
        } else {
          this.status_circle.amount = true
          this.status_circle.positive_amount = res.positive
          this.status_circle.negative_amount = res.negative
          this.status_circle.unknown_amount = res.unknown
          this.status_circle.id = res.file_name

          this.status_circle.update()
          this.status='none'
        }


      } else {
        this.hide(this.load);
        console.log('NOT sup type')
        this.error.nativeElement.textContent = 'Ошибка: неподдерживаемый тип файла'
        this.unhide(this.error)
      }
    }
  }

  checkExtension(filename: string) {
    let obj = filename.split('.')
    let ext = obj[obj.length-1]
    console.log(ext)
    if (ext == 'xlsx' || ext == 'csv') {
      return true
    }
    return false
  }

  hide(el: ElementRef){
    el.nativeElement.classList.add('hide');
  }

  unhide(el: ElementRef){
    el.nativeElement.classList.remove('hide');
  }

}

