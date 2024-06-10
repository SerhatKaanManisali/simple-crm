import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, getDocs, updateDoc } from '@angular/fire/firestore';
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
    onSnapshot(productsCollection, async (snapshot) => {
      const salesData: { [key: string]: number } = {};

      for (const docSnapshot of snapshot.docs) {
        const productData = docSnapshot.data();
        const productName = productData['name'];
        const productDocRef = docSnapshot.ref;
        const salesSubCollection = collection(productDocRef, 'sales');
        const salesSnapshot = await getDocs(salesSubCollection);

        let totalSales = 0;
        salesSnapshot.forEach(salesDoc => {
          const productSalesData = salesDoc.data()['salesData'] || [];
          totalSales += productSalesData.reduce((sum: number, item: any) => sum + item.sales, 0);
        });

        salesData[productName] = totalSales;

        await updateDoc(productDocRef, { sales: totalSales });
      }

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
