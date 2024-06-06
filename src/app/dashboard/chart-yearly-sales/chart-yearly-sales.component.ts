import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-yearly-sales',
  standalone: true,
  imports: [MatSelectModule, MatCardModule, MatInputModule, MatFormFieldModule, CommonModule],
  templateUrl: './chart-yearly-sales.component.html',
  styleUrls: ['./chart-yearly-sales.component.scss']
})
export class ChartYearlySalesComponent implements OnInit {
  firestore: Firestore;
  chart: Chart | undefined;
  availableYears: number[] = [];
  selectedYear: number;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
    this.selectedYear = new Date().getFullYear();
  }

  ngOnInit() {
    this.loadAvailableYears();
  }

  async loadAvailableYears() {
    const productsCollection = collection(this.firestore, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    const yearsSet = new Set<number>();

    for (const doc of productsSnapshot.docs) {
      const salesCollection = collection(this.firestore, `products/${doc.id}/sales`);
      const salesSnapshot = await getDocs(salesCollection);

      salesSnapshot.forEach(salesDoc => {
        const data = salesDoc.data();
        if (data['year']) {
          yearsSet.add(data['year']);
        }
      });
    }

    this.availableYears = Array.from(yearsSet).sort((a, b) => a - b);
    this.loadSalesData(this.selectedYear);
  }

  async onYearChange(event: any) {
    this.selectedYear = event.value;
    this.loadSalesData(this.selectedYear);
  }

  async loadSalesData(year: number) {
    const productsCollection = collection(this.firestore, 'products');
    const salesData: { [key: string]: { [key: string]: number } } = {
      'January': {},
      'February': {},
      'March': {},
      'April': {},
      'May': {},
      'June': {},
      'July': {},
      'August': {},
      'September': {},
      'October': {},
      'November': {},
      'December': {},
    };

    const productsSnapshot = await getDocs(productsCollection);
    const productNames: string[] = [];

    const promises = productsSnapshot.docs.map(async (doc) => {
      const productName = doc.data()['name'];
      productNames.push(productName);

      const salesCollection = collection(this.firestore, `products/${doc.id}/sales`);
      const salesQuerySnapshot = await getDocs(salesCollection);

      salesQuerySnapshot.forEach((salesDoc) => {
        const data = salesDoc.data();
        if (data['year'] === year && Array.isArray(data['salesData'])) {
          data['salesData'].forEach((monthData: { month: string, sales: number }) => {
            if (salesData[monthData.month] !== undefined) {
              if (!salesData[monthData.month][productName]) {
                salesData[monthData.month][productName] = 0;
              }
              salesData[monthData.month][productName] += monthData.sales;
            }
          });
        }
      });
    });

    await Promise.all(promises);

    this.renderChart(Object.keys(salesData), salesData, productNames);
  }

  renderChart(labels: string[], salesData: { [key: string]: { [key: string]: number } }, productNames: string[]) {
    const datasets = productNames.map((productName, index) => {
      const color = ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'][index];
      const borderColor = ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'][index];

      return {
        label: productName,
        data: labels.map(label => salesData[label][productName] || 0),
        backgroundColor: color,
        borderColor: borderColor,
        borderWidth: 1,
      };
    });

    const canvas = document.getElementById('yearly-sales-chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Yearly sales distribution by product in €'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            stacked: true
          }
        }
      }
    });
  }
}
