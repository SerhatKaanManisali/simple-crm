import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartYearlyRevenueComponent } from './chart-yearly-revenue.component';

describe('ChartYearlyRevenueComponent', () => {
  let component: ChartYearlyRevenueComponent;
  let fixture: ComponentFixture<ChartYearlyRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartYearlyRevenueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartYearlyRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
