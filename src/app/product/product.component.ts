import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogAddProductComponent } from './dialog-add-product/dialog-add-product.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    MatPaginatorModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule
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
  products$: any;
  products: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    this.products$ = collectionData(collection(this.firestore, 'products'));
    if (this.products$) {
      this.products = this.products$.subscribe((products: any) => {
        this.dataSource.data = products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  async deleteProduct(productId: string) {
    await deleteDoc(doc(this.firestore, 'products', productId));
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.cdr.detectChanges();
    });

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setDefaultSort();
  }

  ngOnDestroy() {
    if (this.products) {
      this.products.unsubscribe();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private setDefaultSort() {
    this.sort.sort({ id: 'price', start: 'desc', disableClear: false });
    this.cdr.detectChanges();
  }
}
