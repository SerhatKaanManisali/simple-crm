import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-chart-total-revenue',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './chart-total-revenue.component.html',
  styleUrl: './chart-total-revenue.component.scss'
})
export class ChartTotalRevenueComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  chart: Chart<'pie', number[], string> | undefined;

  ngOnInit() {
    this.loadRevenueData();
  }

  loadRevenueData() {
    const productsCollection = collection(this.firestore, 'products');

    onSnapshot(productsCollection, (snapshot) => {
      const revenueData: { [key: string]: number } = {
        'High-End Gaming-PC': 0,
        'Mid-Range Gaming-PC': 0,
        'Budget Gaming-PC': 0,
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        const sales = data['sales'] || 0;
        const price = data['price'] || 0;
        const revenue = sales * price;

        if (doc.id.includes('Cjaq6S3mkcCxsSpL4DhV')) {
          revenueData['High-End Gaming-PC'] += revenue;
        } else if (doc.id.includes('m1lnUb1y00dmkludaIBl')) {
          revenueData['Mid-Range Gaming-PC'] += revenue;
        } else if (doc.id.includes('aAbXmau9g9yOXNigIcJY')) {
          revenueData['Budget Gaming-PC'] += revenue;
        }
      });
      this.renderChart(Object.keys(revenueData), Object.values(revenueData));
    });
  }


  renderChart(labels: string[], data: number[]) {
    const canvas = document.getElementById('total-revenue-chart') as HTMLCanvasElement;
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
          label: 'Total revenue',
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
            text: 'Total revenue distribution by product'
          }
        }
      }
    });
  }
}
