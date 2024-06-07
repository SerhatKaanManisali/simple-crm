import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-chart-yearly-sales',
  standalone: true,
  imports: [MatSelectModule, MatCardModule, MatInputModule, MatFormFieldModule, CommonModule],
  templateUrl: './chart-yearly-sales.component.html',
  styleUrls: ['./chart-yearly-sales.component.scss']
})
export class ChartYearlySalesComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  chart: Chart<'pie', number[], string> | undefined;
  availableYears: number[] = [];
  selectedYear: number;

  constructor() {
    this.selectedYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.loadAvailableYears();
    this.loadSalesData(this.selectedYear);
  }

  async loadAvailableYears(): Promise<void> {
    const productsCollection = collection(this.firestore, 'products');
    const snapshot = await getDocs(productsCollection);

    const yearsSet: Set<number> = new Set();

    for (const doc of snapshot.docs) {
      const salesSubCollection = collection(doc.ref, 'sales');
      const salesSnapshot = await getDocs(salesSubCollection);

      salesSnapshot.forEach((salesDoc) => {
        const year = salesDoc.data()['year'];
        if (year) {
          yearsSet.add(year);
        }
      });
    }

    this.availableYears = Array.from(yearsSet).sort((a, b) => b - a);
    if (this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[0];
    }
  }

  onYearChange(event: any): void {
    this.selectedYear = event.value;
    this.loadSalesData(this.selectedYear);
  }

  async loadSalesData(year: number) {
    const productsCollection = collection(this.firestore, 'products');

    const salesData: { [key: string]: number } = {
      'High-End Gaming-PC': 0,
      'Mid-Range Gaming-PC': 0,
      'Budget Gaming-PC': 0,
    };

    const snapshot = await getDocs(productsCollection);

    for (const doc of snapshot.docs) {
      const salesSubCollection = collection(doc.ref, 'sales');
      const yearQuery = query(salesSubCollection, where('year', '==', year));
      const salesSnapshot = await getDocs(yearQuery);

      salesSnapshot.forEach((salesDoc) => {
        const productSalesData = salesDoc.data()['salesData'] || [];
        const totalSales = productSalesData.reduce((sum: number, item: any) => sum + item.sales, 0);

        if (doc.id === 'Cjaq6S3mkcCxsSpL4DhV') {
          salesData['High-End Gaming-PC'] += totalSales;
        } else if (doc.id === 'm1lnUb1y00dmkludaIBl') {
          salesData['Mid-Range Gaming-PC'] += totalSales;
        } else if (doc.id === 'aAbXmau9g9yOXNigIcJY') {
          salesData['Budget Gaming-PC'] += totalSales;
        }
      });
    }
    this.renderChart(Object.keys(salesData), Object.values(salesData));
  }

  renderChart(labels: string[], data: number[]): void {
    const canvas = document.getElementById('yearly-sales-chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: `Sales for ${this.selectedYear}`,
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Sales distribution by product for ${this.selectedYear}`
          }
        }
      }
    };

    this.chart = new Chart(ctx, chartConfig);
  }
}
