import { Component, inject } from '@angular/core';
import { DialogAddProductComponent } from './dialog-add-product/dialog-add-product.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [DialogAddProductComponent, MatIconModule, MatTooltipModule, MatButtonModule, MatTableModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  dialogAddProduct: DialogAddProductComponent = inject(DialogAddProductComponent);
}
