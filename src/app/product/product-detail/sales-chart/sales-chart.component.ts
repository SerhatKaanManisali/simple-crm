import { Component, Injectable, Input, OnInit, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where, doc, updateDoc, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';

Chart.register(...registerables);
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatButtonModule],
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss']
})
export class SalesChartComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  chart: Chart | undefined;
  years: number[] = [2022, 2023, 2024];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: string = '';
  selectedSales: number = 0;
  salesData: { month: string, sales: number }[] = [];
  currentSalesData: { month: string, sales: number }[] = [];
  @Input() productId: string = '';

  ngOnInit() {
    this.getSalesData(this.selectedYear);
  }

  async getSalesData(year: number) {
    const q = query(collection(this.firestore, 'sales'), where('year', '==', year));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const salesDoc = querySnapshot.docs[0].data();
      this.salesData = salesDoc['salesData'];
      this.createChart();
    } else {
      this.salesData = [
        { month: 'January', sales: 0 },
        { month: 'February', sales: 0 },
        { month: 'March', sales: 0 },
        { month: 'April', sales: 0 },
        { month: 'May', sales: 0 },
        { month: 'June', sales: 0 },
        { month: 'July', sales: 0 },
        { month: 'August', sales: 0 },
        { month: 'September', sales: 0 },
        { month: 'October', sales: 0 },
        { month: 'November', sales: 0 },
        { month: 'December', sales: 0 }
      ];
      this.createChart();
    }
  }

  createChart() {
    const data = {
      labels: this.salesData.map(d => d.month),
      datasets: [
        {
          label: `Sales in ${this.selectedYear}`,
          data: this.salesData.map(d => d.sales),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const chartItem: ChartItem = document.getElementById('salesChart') as ChartItem;
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(chartItem, config);
  }

  async updateSalesData() {
    await this.getSalesData(this.selectedYear);
  }

  onMonthChange() {
    const monthData = this.currentSalesData.find(data => data.month === this.selectedMonth);
    if (monthData) {
      this.selectedSales = monthData.sales;
    } else {
      this.selectedSales = 0;
    }
  }

  async setSale() {
    const monthIndex = this.currentSalesData.findIndex(data => data.month === this.selectedMonth);
    if (monthIndex !== -1) {
      this.currentSalesData[monthIndex].sales = this.selectedSales;
    } else {
      this.currentSalesData.push({ month: this.selectedMonth, sales: this.selectedSales });
    }
    await this.updateSalesDataInFirestore();
    this.createChart();
  }

  async updateYear(newYear: number) {
    this.selectedYear = newYear;
    await this.getSalesData(newYear);
  }

  async addSale(month: string, sales: number) {
    const monthIndex = this.salesData.findIndex(data => data.month === month);
    if (monthIndex !== -1) {
      this.salesData[monthIndex].sales += sales;
    } else {
      this.salesData.push({ month: month, sales: sales });
    }
    await this.updateSalesDataInFirestore();
    this.createChart();
  }

  async updateSalesDataInFirestore() {
    const q = query(collection(this.firestore, `product/${this.productId}/sales`), where('year', '==', this.selectedYear));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const salesDocRef = querySnapshot.docs[0].ref;
      await updateDoc(salesDocRef, { salesData: this.salesData });
    } else {
      // Wenn kein Dokument für das aktuelle Jahr existiert, füge es hinzu
      const newDocRef = doc(collection(this.firestore, 'sales'));
      await setDoc(newDocRef, { year: this.selectedYear, salesData: this.salesData });
    }
  }
}
