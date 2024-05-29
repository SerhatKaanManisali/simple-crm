import { Component, OnInit, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  route: ActivatedRoute = inject(ActivatedRoute);

  productId = '';
  product: Product = {
    id: '',
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

  specs: { label: string, value: string | number }[] = [];

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.getProduct();
  }

  async getProduct() {
    await getDoc(doc(this.firestore, 'products', this.productId)).then((product: any) => {
      this.product = product.data();

      this.specs = [
        { label: 'CPU', value: this.product.cpu },
        { label: 'GPU', value: this.product.gpu },
        { label: 'Storage', value: this.product.storage },
        { label: 'RAM', value: this.product.ram },
        { label: 'Mainboard', value: this.product.mainboard },
        { label: 'PSU', value: this.product.psu },
        { label: 'Case', value: this.product.case },
        { label: 'Price', value: this.product.price }
      ];
    });
  }
}
