import { Component, Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-dialog-add-product',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-add-product.component.html',
  styleUrl: './dialog-add-product.component.scss'
})
export class DialogAddProductComponent {
  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);
  productForm: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);

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
    price: 0
  }

  constructor() {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      cpu: [''],
      gpu: [''],
      storage: [''],
      ram: [''],
      mainboard: [''],
      psu: [''],
      case: [''],
      price: ['', [Validators.required]],
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddProductComponent);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.removeWhitespace(result);
        await this.addDoc(result);
      }
    });
  }

  async addDoc(product: Product) {
    await addDoc(this.getProductsRef(), product).then(async (productInfo: any) => {
      await updateDoc(this.getSingleDocRef('products', productInfo.id), {
        id: productInfo.id,
      });
    });
  }

  getProductsRef() {
    return collection(this.firestore, 'products');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  removeWhitespace(result: any) {
    Object.keys(result).forEach(key => {
      if (typeof result[key] === 'string') {
        result[key] = result[key].trim();
      }
    });
  }
}
