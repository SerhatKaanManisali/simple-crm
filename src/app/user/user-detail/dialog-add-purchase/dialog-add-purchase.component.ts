import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-add-purchase',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-add-purchase.component.html',
  styleUrls: ['./dialog-add-purchase.component.scss']
})
export class DialogAddPurchaseComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);
  purchaseForm: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);

  purchase = {
    name: '',
    purchaseDate: ''
  };

  products: any[] = [];

  constructor() {
    this.purchaseForm = this.formBuilder.group({
      product: ['', [Validators.required]],
      purchaseDate: ['', [this.futureDateValidator]],
    });
  }

  ngOnInit() {
    this.subscribeToProducts();
  }

  subscribeToProducts() {
    const productsCollection = collection(this.firestore, 'products');
    onSnapshot(productsCollection, (querySnapshot) => {
      this.products = querySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a['name'].localeCompare(b['name']));
    });
  }

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    return d ? d <= today : false;
  }

  futureDateValidator(control: FormControl) {
    const date = new Date(control.value);
    const today = new Date();
    if (date > today) {
      return { 'futureDate': true };
    }
    return null;
  }
}
