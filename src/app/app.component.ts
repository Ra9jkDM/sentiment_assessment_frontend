import { Component, ViewChild, ElementRef, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, 
  NgbAccordionModule, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule,
  NgbRatingModule,
  NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgbCollapse, NgbDropdown, NgbDropdownMenu, 
    NgbDropdownToggle, NgbAccordionModule, NgbDatepickerModule, NgbRatingModule, NgbModule, FormsModule,
  HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'sentiment_assessment_web';

  public isCollapsed : boolean = true;

}