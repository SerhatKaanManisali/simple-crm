import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, query, where, getDocs, DocumentData } from '@angular/fire/firestore';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js/auto';

@Component({
  selector: 'app-chart-yearly-revenue',
  standalone: true,
  imports: [MatSelectModule, MatCardModule, MatInputModule, MatFormFieldModule, CommonModule],
  templateUrl: './chart-yearly-revenue.component.html',
  styleUrls: ['./chart-yearly-revenue.component.scss']
})
export class ChartYearlyRevenueComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  chart: Chart<'pie', number[], string> | undefined;
  availableYears: number[] = [];
  selectedYear: number;

  constructor() {
    this.selectedYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.loadAvailableYears();
    this.loadRevenueData(this.selectedYear);
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
    this.loadRevenueData(this.selectedYear);
  }

  async loadRevenueData(year: number) {
    const productsCollection = collection(this.firestore, 'products');

    const revenueData: { [key: string]: number } = {
      'High-End Gaming-PC': 0,
      'Mid-Range Gaming-PC': 0,
      'Budget Gaming-PC': 0,
    };

    const snapshot = await getDocs(productsCollection);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const price = data['price'] || 0;
      const salesSubCollection = collection(doc.ref, 'sales');
      const yearQuery = query(salesSubCollection, where('year', '==', year));
      const salesSnapshot = await getDocs(yearQuery);

      salesSnapshot.forEach((salesDoc) => {
        const salesData = salesDoc.data()['salesData'] || [];
        const totalSales = salesData.reduce((sum: number, item: any) => sum + item.sales, 0);
        const revenue = totalSales * price;

        if (doc.id === 'Cjaq6S3mkcCxsSpL4DhV') {
          revenueData['High-End Gaming-PC'] += revenue;
        } else if (doc.id === 'm1lnUb1y00dmkludaIBl') {
          revenueData['Mid-Range Gaming-PC'] += revenue;
        } else if (doc.id === 'aAbXmau9g9yOXNigIcJY') {
          revenueData['Budget Gaming-PC'] += revenue;
        }
      });
    }
    this.renderChart(Object.keys(revenueData), Object.values(revenueData));
  }

  renderChart(labels: string[], data: number[]): void {
    const canvas = document.getElementById('yearly-revenue-chart') as HTMLCanvasElement;
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
          label: `Revenue for ${this.selectedYear}`,
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
            text: `Revenue distribution by product for ${this.selectedYear}`
          }
        }
      }
    };

    this.chart = new Chart(ctx, chartConfig);
  }
}
