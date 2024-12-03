import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionResultsComponent } from './inspection-results.component';

describe('InspectionResultsComponent', () => {
  let component: InspectionResultsComponent;
  let fixture: ComponentFixture<InspectionResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
