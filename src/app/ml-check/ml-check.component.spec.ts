import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlCheckComponent } from './ml-check.component';

describe('MlCheckComponent', () => {
  let component: MlCheckComponent;
  let fixture: ComponentFixture<MlCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MlCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
