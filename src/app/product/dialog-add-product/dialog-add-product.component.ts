import { Component, Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
      price: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddProductComponent);

    dialogRef.afterClosed().subscribe();
  }
}
