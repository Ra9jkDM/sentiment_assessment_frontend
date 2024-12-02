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
  @ViewChild('load') load!: ElementRef;
  @ViewChild('result') result!: ElementRef;
  
  checkText() {
    console.info('Start check');
    this.hide(this.btn);

    this.unhide(this.load);
    this.unhide(this.result);

  }

  hide(el: ElementRef){
    el.nativeElement.classList.add('hide');
  }

  unhide(el: ElementRef){
    el.nativeElement.classList.remove('hide');
  }

}
