import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTotalRevenueComponent } from './chart-total-revenue.component';

describe('ChartTotalRevenueComponent', () => {
  let component: ChartTotalRevenueComponent;
  let fixture: ComponentFixture<ChartTotalRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartTotalRevenueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartTotalRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
