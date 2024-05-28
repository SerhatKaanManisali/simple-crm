import { AfterViewInit, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogAddProductComponent } from './dialog-add-product/dialog-add-product.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    RouterModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnDestroy, AfterViewInit {
  firestore = inject(Firestore);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: RouterModule = inject(RouterModule);
  dialogAddProduct: DialogAddProductComponent = inject(DialogAddProductComponent);
  displayedColumns: string[] = [
    'name',
    'sales',
    'price',
    'more-options'
  ];

  dataSource = new MatTableDataSource();
  products$;
  products;

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.products$ = collectionData(collection(this.firestore, 'products'));
    if (this.products$) {
      this.products = this.products$.subscribe((products) => {
        this.dataSource.data = products;
        this.dataSource.sort = this.sort;
      });
    }
  }

  async deleteProduct(productId: string) {
    await deleteDoc(doc(this.firestore, 'products', productId));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.products) {
      this.products.unsubscribe();
    }
  }
}
