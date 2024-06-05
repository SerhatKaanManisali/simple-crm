import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-chart-total-sales',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './chart-total-sales.component.html',
  styleUrls: ['./chart-total-sales.component.scss']
})
export class ChartTotalSalesComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  chart: Chart<'pie', number[], string> | undefined;

  ngOnInit() {
    this.loadSalesData();
  }

  loadSalesData() {
    const productsCollection = collection(this.firestore, 'products');

    onSnapshot(productsCollection, (snapshot) => {
      const salesData: { [key: string]: number } = {
        'High-End Gaming-PC': 0,
        'Mid-Range Gaming-PC': 0,
        'Budget Gaming-PC': 0,
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        const sales = data['sales'] || 0;

        if (doc.id.includes('Cjaq6S3mkcCxsSpL4DhV')) {
          salesData['High-End Gaming-PC'] += sales;
        } else if (doc.id.includes('m1lnUb1y00dmkludaIBl')) {
          salesData['Mid-Range Gaming-PC'] += sales;
        } else if (doc.id.includes('aAbXmau9g9yOXNigIcJY')) {
          salesData['Budget Gaming-PC'] += sales;
        }
      });
      this.renderChart(Object.keys(salesData), Object.values(salesData));
    });
  }

  renderChart(labels: string[], data: number[]) {
    const canvas = document.getElementById('total-sales-chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Sales',
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
            text: 'Total sales distribution by product'
          }
        }
      }
    });
  }
}
