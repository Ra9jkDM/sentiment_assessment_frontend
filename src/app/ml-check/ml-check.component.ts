import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../server_interaction/account.service';

@Component({
  selector: 'app-ml-check',
  standalone: true,
  imports: [RouterLink],
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

  @ViewChild('table_result') table_result!: ElementRef<HTMLDivElement>
  @ViewChild('status_circle') status_circle!: ElementRef<HTMLDivElement>;

  @ViewChild('error') error!: ElementRef<HTMLParagraphElement>; 

  positive: number = 140
  negative: number = 100
  unknown: number = 1140
  
  constructor(private account: AccountService) {
    account.isLogin();
  }
  
  async checkText() {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    
    // console.info('Start check');
    // console.info('Text:' + this.text.nativeElement.value);

    this.hide(this.btn);
    this.hide(this.result);
    this.hide(this.table_result)

    this.unhide(this.load);
    // await sleep(750);

    let req = await this.account.post('ml/native_bias', {'text': this.text.nativeElement.value});
    let result = await req.json()

    this.sentiment.nativeElement.classList.value = '';

    if (result.pred_word == 'positive') {
      this.sentiment.nativeElement.classList.add('text-success');
      this.sentiment.nativeElement.innerText = 'Положительная';
    } else {
      this.sentiment.nativeElement.classList.add('text-danger');
      this.sentiment.nativeElement.innerText = 'Отрицательная';
    }

    this.hide(this.load);
    this.unhide(this.btn);
    this.unhide(this.result);

    

    // if (Math.random() < 0.5) {
    //   this.sentiment.nativeElement.classList.add('text-success');
    //   this.sentiment.nativeElement.innerText = 'Положительная';
    // } else {
    //   this.sentiment.nativeElement.classList.add('text-danger');
    //   this.sentiment.nativeElement.innerText = 'Отрицательная';
    // }
  }

  async checkTable() {
    this.hide(this.result);
    this.hide(this.table_result)

    this.unhide(this.load);
    if (this.file.nativeElement.files && this.file.nativeElement.files[0]) {
      let file = this.file.nativeElement.files[0]
      console.log(file)
      if (this.checkExtension(file.name)) {
        console.log('Supported type')
        this.hide(this.error)
        let req_table = await this.account.post_file('ml/lstm/table', {'file': file})
        let res = await this.account.isRequestSuccessful(req_table)

        this.hide(this.load);
        if (!res) {
          this.error.nativeElement.textContent = 'Ошибка: сервер не отвечает'
          this.unhide(this.error)
        } else {
          this.positive = this.round(res.positive / res.rows_amount)
          this.negative = this.round(res.negative / res.rows_amount)
          this.unknown = this.round(res.unknown / res.rows_amount)

          this.showTableSentiment(this.negative, this.unknown)
        }

        console.log(res)

      } else {
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

  showTableSentiment(negative: number, unknown: number) {
    this.unhide(this.table_result)
    console.log('Change style')
    let one_percent = 360 / 100

    negative *= one_percent
    unknown *= one_percent

    const red = '#dc3545'
    const green = '#198754'
    const blue = '#0d6efd'

    let grad = 'linear-gradient(white, white), \
    conic-gradient('+red+' 0deg, '+red+' '+negative+'deg, \
    '+blue+' '+negative+'deg, '+blue+' '+(negative+unknown)+'deg, \
    '+green+' '+(negative+unknown)+'deg, '+green+')'
    this.status_circle.nativeElement.style.backgroundImage = grad;
  }


  round(num: number) {
    return Math.round(num * 10000) / 100
  }
}
