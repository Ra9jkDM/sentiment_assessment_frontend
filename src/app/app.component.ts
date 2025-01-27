import { Component, ViewChild, ElementRef, inject, HostListener, viewChild, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, 
  NgbAccordionModule, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule,
  NgbRatingModule,
  NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from './server_interaction/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgbCollapse, NgbDropdown, NgbDropdownMenu, 
    NgbDropdownToggle, NgbAccordionModule, NgbDatepickerModule, NgbRatingModule, NgbModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'sentiment_assessment_web';
  @ViewChild('img') img!: ElementRef<HTMLImageElement>

  public isCollapsed : boolean = true;

  constructor(public account: AccountService) {
    
  }

  async ngOnInit(){
    await this.loadData()
  }

  async loadData() {
    
  }

  closeNav() {
    if (window.innerWidth < 992) {
      this.isCollapsed = true;
    }
  }


}