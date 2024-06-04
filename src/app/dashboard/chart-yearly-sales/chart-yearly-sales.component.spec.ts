import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartYearlySalesComponent } from './chart-yearly-sales.component';

describe('ChartYearlySalesComponent', () => {
  let component: ChartYearlySalesComponent;
  let fixture: ComponentFixture<ChartYearlySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartYearlySalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartYearlySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
