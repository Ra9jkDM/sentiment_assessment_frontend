import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AccountService } from '../../server_interaction/account.service';

@Component({
  selector: 'app-circle-status',
  standalone: true,
  imports: [],
  templateUrl: './circle-status.component.html',
  styleUrl: './circle-status.component.sass'
})
export class CircleStatusComponent {
  @ViewChild('status_circle') status_circle!: ElementRef<HTMLDivElement>;
  @ViewChild('file_url') file_url!: ElementRef<HTMLLinkElement>;

  @Input() id: number = -1
  
  @Input() positive: number = 0
  @Input() negative: number = 0
  @Input() unknown: number = 0


  @Input() amount: boolean = false
  @Input() positive_amount: number = 0
  @Input() negative_amount: number = 0
  @Input() unknown_amount: number = 0

  download_url: string = ''

  constructor(private account: AccountService) {
  }

  ngOnInit() {

  }

  ngAfterContentInit() {
    
  }

  async ngAfterViewInit() {
    this.update()
  }

  update() {
    if (this.amount) {
      this.calculatePercentages()
    }

    this.updateStatus()
    this.download_url = this.account.getBaseUrl() + "history/file?id=" + this.id
    this.file_url.nativeElement.href = this.download_url
  }

  updateStatus() {
    let one_percent = 360 / 100

    let negative = this.negative * one_percent
    let unknown = this.unknown * one_percent

    const red = '#dc3545'
    const green = '#198754'
    const blue = '#0d6efd'

    let grad = 'linear-gradient(white, white), \
    conic-gradient('+red+' 0deg, '+red+' '+negative+'deg, \
    '+blue+' '+negative+'deg, '+blue+' '+(negative+unknown)+'deg, \
    '+green+' '+(negative+unknown)+'deg, '+green+')'
    this.status_circle.nativeElement.style.backgroundImage = grad;
  }

  calculatePercentages() {
    let rows_amount = this.positive_amount + this.negative_amount + this.unknown_amount
    this.positive = this.round(this.positive_amount / rows_amount)
    this.negative = this.round(this.negative_amount / rows_amount)
    this.unknown = this.round(this.unknown_amount/ rows_amount)
  }

  round(num: number) {
    return Math.round(num * 10000) / 100
  }
}
