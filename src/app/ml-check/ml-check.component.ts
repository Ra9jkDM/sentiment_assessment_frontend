import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ml-check',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ml-check.component.html',
  styleUrl: './ml-check.component.sass'
})
export class MlCheckComponent {
  @ViewChild('checkButton') btn!: ElementRef;
  @ViewChild('text') text!: ElementRef<HTMLTextAreaElement>

  @ViewChild('load') load!: ElementRef;
  @ViewChild('result') result!: ElementRef;
  @ViewChild('sentiment') sentiment!: ElementRef<HTMLSpanElement>;
  
  
  async checkText() {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    
    console.info('Start check');
    console.info('Text:' + this.text.nativeElement.value);

    this.hide(this.btn);
    this.hide(this.result);

    this.unhide(this.load);
    await sleep(750);
    this.hide(this.load);
    this.unhide(this.btn);
    this.unhide(this.result);

    this.sentiment.nativeElement.classList.value = '';

    if (Math.random() < 0.5) {
      this.sentiment.nativeElement.classList.add('text-success');
      this.sentiment.nativeElement.innerText = 'Положительная';
    } else {
      this.sentiment.nativeElement.classList.add('text-danger');
      this.sentiment.nativeElement.innerText = 'Отрицательная';
    }
  }

  hide(el: ElementRef){
    el.nativeElement.classList.add('hide');
  }

  unhide(el: ElementRef){
    el.nativeElement.classList.remove('hide');
  }

}
