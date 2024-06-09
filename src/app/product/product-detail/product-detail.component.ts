import { Component, OnInit, inject } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditComponentComponent } from './dialog-edit-component/dialog-edit-component.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

type ProductKeys = keyof Omit<Product, 'id' | 'name' | 'description' | 'sales'>;

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, SalesChartComponent, CommonModule, MatTooltipModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  route: ActivatedRoute = inject(ActivatedRoute);
  dialog: MatDialog = inject(MatDialog);

  productId = '';
  product: Product = {
    id: '',
    img: '',
    name: '',
    description: '',
    cpu: '',
    gpu: '',
    storage: '',
    ram: '',
    mainboard: '',
    psu: '',
    case: '',
    price: 0,
    sales: 0
  }

  specs: { label: ProductKeys, icon: string, value: string | number, tooltip: string }[] = [];


  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.getProduct();
  }

  async getProduct() {
    const productDoc = await getDoc(doc(this.firestore, 'products', this.productId));
    this.product = productDoc.data() as Product;

    this.specs = [
      { label: 'cpu', icon: 'cpu-icon.png', value: this.product.cpu, tooltip: 'CPU' },
      { label: 'gpu', icon: 'gpu-icon.png', value: this.product.gpu, tooltip: 'GPU' },
      { label: 'storage', icon: 'storage-icon.png', value: this.product.storage, tooltip: 'Storage' },
      { label: 'ram', icon: 'ram-icon.png', value: this.product.ram, tooltip: 'RAM' },
      { label: 'mainboard', icon: 'mainboard-icon.png', value: this.product.mainboard, tooltip: 'Mainboard' },
      { label: 'psu', icon: 'psu-icon.png', value: this.product.psu, tooltip: 'PSU' },
      { label: 'case', icon: 'case-icon.png', value: this.product.case, tooltip: 'Case' },
      { label: 'price', icon: 'price-icon.png', value: this.product.price, tooltip: 'Price' }
    ];
  }

  editComponent(spec: { label: ProductKeys, icon: string, value: string | number }) {
    const dialogRef = this.dialog.open(DialogEditComponentComponent, {
      data: { label: spec.label, displayLabel: spec.icon, value: spec.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        (this.product[spec.label] as string | number) = result;
        const productDoc = doc(this.firestore, 'products', this.productId);
        updateDoc(productDoc, { [spec.label]: result });
        this.specs = this.specs.map(s => s.label === spec.label ? { label: s.label, icon: s.icon, value: result, tooltip: s.tooltip } : s);
      }
    });
  }
}
