import { Component, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { NgbAccordionModule, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../server_interaction/account.service';

export interface History {
  id: number;
  title: string;
  text: string;
  result: string;
  date: string;
}

@Component({
  selector: 'app-inspection-results',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule, RouterLink, NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './inspection-results.component.html',
  styleUrl: './inspection-results.component.sass'
})

export class InspectionResultsComponent {
  results: History[] = [
    {id: 1, title: "Тестовая проверка", text: "Some text", 
      result:'Положительный', date:"10.01.2022"},
    {id: 2, title: "Из VK", text: "Some text", 
        result:'Отрицательный', date:"11.01.2022"},
    {id: 4, title: "Из tg очень длинное название __ 001", text: "Some text", 
        result:'Положительный', date:"14.01.2022"},
    {id: 100, title: "Проверка xlsx", text: "Some text", 
        result:'Отрицательный', date:"10.04.2022"}
  ];
  pages: Array<number>= Array(1,2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13);

  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);

  constructor(private account: AccountService) {
	account.isLogin();

    for(let i=0; i<22; i++) {
      this.results.push({id: 100+i, title: "Проверка xlsx "+i, text: "Some text", 
        result:'Отрицательный', date:"10.04.2022"})
    }
  }

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
}
