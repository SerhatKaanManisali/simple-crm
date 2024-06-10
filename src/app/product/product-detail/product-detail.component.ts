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

  specs: { label: ProductKeys, displayLabel: string, value: string | number, image: string }[] = [];


  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.getProduct();
  }

  async getProduct() {
    const productDoc = await getDoc(doc(this.firestore, 'products', this.productId));
    this.product = productDoc.data() as Product;

    this.specs = [
      { label: 'cpu', displayLabel: 'CPU', value: this.product.cpu, image: 'cpu-icon.png' },
      { label: 'gpu', displayLabel: 'GPU', value: this.product.gpu, image: 'gpu-icon.png' },
      { label: 'storage', displayLabel: 'Storage', value: this.product.storage, image: 'storage-icon.png' },
      { label: 'ram', displayLabel: 'RAM', value: this.product.ram, image: 'ram-icon.png' },
      { label: 'mainboard', displayLabel: 'Mainboard', value: this.product.mainboard, image: 'mainboard-icon.png' },
      { label: 'psu', displayLabel: 'PSU', value: this.product.psu, image: 'psu-icon.png' },
      { label: 'case', displayLabel: 'Case', value: this.product.case, image: 'case-icon.png' },
      { label: 'price', displayLabel: 'Price', value: this.product.price, image: 'price-icon.png' }
    ];

  }

  editComponent(spec: { label: ProductKeys, displayLabel: string, value: string | number, image: string }) {
    const dialogRef = this.dialog.open(DialogEditComponentComponent, {
      data: { label: spec.label, displayLabel: spec.displayLabel, value: spec.value, image: spec.image }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        (this.product[spec.label] as string | number) = result;
        const productDoc = doc(this.firestore, 'products', this.productId);
        updateDoc(productDoc, { [spec.label]: result });
        this.specs = this.specs.map(s => s.label === spec.label ? { label: s.label, displayLabel: s.displayLabel, value: result, image: s.image } : s);
      }
    });
  }
}
