import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule, JsonPipe, DatePipe, NgIf } from '@angular/common';
import { NgbAccordionModule, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../server_interaction/account.service';
import { NotificationComponent } from '../elements/notification/notification.component';
import { json } from 'express';
import { CircleStatusComponent } from '../elements/circle-status/circle-status.component';


export interface TextHistory {
	username: string
	id: number
	text: string;
	date: string;
	result: string
	name: string

	positive: number
	negative: number
	unknown: number
  }

@Component({
  selector: 'app-inspection-results',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule, RouterLink, NgbDatepickerModule,
	 FormsModule, JsonPipe, NotificationComponent, NgIf, CircleStatusComponent],
  templateUrl: './inspection-results.component.html',
  styleUrl: './inspection-results.component.sass'
})

export class InspectionResultsComponent {
	@ViewChild(NotificationComponent)
	notification!: NotificationComponent;
	@ViewChild('page_numbers') page_numbers!: ElementRef<HTMLUListElement>

	RECORDS_ON_PAGE: number = 5
	datepipe = new DatePipe('en-US')

	history_type: string = 'text'
  	pages: Array<number>= Array(1);
  	text_results: TextHistory[] = Array()
  	max_page_idx = 1
  	current_page: number = 1

  	calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);

  constructor(private account: AccountService) {
	account.isLogin();
  }

  async ngAfterViewInit() {
	await this.loadData()
  }

  async loadData() {
	let req = await this.account.get('history/length?history_type='+this.history_type)
	let jsonObj = await req.json();
	console.log('LoadData', jsonObj)

	let page_len = this.countPageLen(jsonObj)
	this.max_page_idx = page_len

	
	console.log('pages', this.pages)
	this.pages = [1]
	for(let i = 1; i < page_len; i++) {
		this.pages.push(i+1)
	}
	console.log('pages', this.pages)

	await this.changePage(1)
  }

  private async loadRecords(page: number) {
	let req = await this.account.get('history?history_type='+this.history_type+'&page=' + page)
	let jsonObj = await req.json();
	console.log(jsonObj)

	this.text_results = Array()

	for(let i in jsonObj) {
		let date_str = this.datepipe.transform(jsonObj[i].date, 'dd-MM-YYYY HH:mm:ss')
		
		let item = {username: jsonObj[i].username, id: jsonObj[i].id,
			text: jsonObj[i].text, date: date_str + '', result: 'Нейтральный', name: jsonObj[i].name,
			positive: jsonObj[i].positive, negative: jsonObj[i].negative, unknown: jsonObj[i].unknown
		}

		if (this.history_type == 'text') {
			item['name'] = item['date']
			item['date'] = ''

			let tmp = 'Нейтральный';
	
			if (item.positive) {
				tmp = 'Положительный'
			} else if (item.negative) {
				tmp = 'Негативный'
			}
			item.result = tmp
			this.text_results.push(item)
		} else if (this.history_type == 'table') {
			item.id = jsonObj[i].file
			this.text_results.push(item)
		}
	}
  }

  private countPageLen(pages: number) {
	let remainder = pages % this.RECORDS_ON_PAGE
	let page_len = (pages - remainder) / this.RECORDS_ON_PAGE
	if (remainder > 0) {
		page_len += 1
	}

	return page_len
  }

  async changeHitoryType(type: string) {
	console.log(type)
	this.history_type = type
	await this.loadData()
  }

  async changePage(page: number) {
	console.log(this.page_numbers)
	console.log(this.page_numbers.nativeElement.children)

	this.current_page = page
	if (this.current_page < 1) {
		this.current_page = 1
	} else if (this.current_page > this.max_page_idx) {
		this.current_page = this.max_page_idx
	}

	await this.loadRecords(this.current_page)
	this.updateCurrentPageId()
  }

  updateCurrentPageId() {
	console.log(this.current_page)
	for(let i = 1; i < this.page_numbers.nativeElement.children.length - 1; i++) {
		this.page_numbers.nativeElement.children[i].classList.remove('current-page')
	}

	this.page_numbers.nativeElement.children[this.current_page].classList.add('current-page')

  }

  async nextPage() {
	this.current_page += 1
	this.changePage(this.current_page)
  }

  async previousPage() {
	this.current_page -= 1
	this.changePage(this.current_page)
  }

  async deleteRecord(username: string, id: number) {
	let req = await this.account.post('history/delete', {'id': id, 'history_type': this.history_type})
	let res = await this.account.isRequestSuccessful(req)
	
	if (res) {
		this.text_results = this.text_results.filter(obj => { return obj.id !== id})
	}
	else {
		this.notification.showNotification(() => {}, 'Ошибка', 'Не удалось сохранить внесенные изменеия', 'confirm');
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
