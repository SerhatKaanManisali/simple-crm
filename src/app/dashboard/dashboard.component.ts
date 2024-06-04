import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartTotalRevenueComponent } from './chart-total-revenue/chart-total-revenue.component';
import { ChartTotalSalesComponent } from './chart-total-sales/chart-total-sales.component';
import { ChartYearlyRevenueComponent } from './chart-yearly-revenue/chart-yearly-revenue.component';
import { ChartYearlySalesComponent } from './chart-yearly-sales/chart-yearly-sales.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, ChartTotalRevenueComponent, ChartTotalSalesComponent, ChartYearlyRevenueComponent, ChartYearlySalesComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

}
