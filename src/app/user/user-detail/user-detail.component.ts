import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditUserComponent } from './dialog-edit-user/dialog-edit-user.component';
import { DialogEditAddressComponent } from './dialog-edit-address/dialog-edit-address.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  route: ActivatedRoute = inject(ActivatedRoute);
  dialog: MatDialog = inject(MatDialog);

  userId = '';
  user: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: 123456789,
    birthDate: 0,
    street: '',
    zipCode: 12345,
    city: '',
    fullName: '',
    purchaseHistory: [],
    notes: ''
  };

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.subscribeToUser();
    this.subscribeToPurchaseHistory();
  }

  subscribeToUser() {
    const userDocRef = doc(this.firestore, 'users', this.userId);
    onSnapshot(userDocRef, (userDoc) => {
      this.user = userDoc.data() as User;
    });
  }

  subscribeToPurchaseHistory() {
    const productsCollection = collection(this.firestore, 'products');
    onSnapshot(productsCollection, (querySnapshot) => {
      const purchaseHistory: any[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.data()['id'] === this.userId) {
          purchaseHistory.push(doc.data());
        }
      });
      this.user.purchaseHistory = purchaseHistory;
    });
  }

  openUserEditor() {
    const dialogRef = this.dialog.open(DialogEditUserComponent);
    dialogRef.componentInstance.user = { ...this.user };
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.removeWhitespace(result);
        this.user.firstName = result.firstName;
        this.user.lastName = result.lastName;
        this.user.email = result.email;
        this.user.birthDate = result.birthDate;
        await this.updateUser();
      }
    });
  }

  openAddressEditor() {
    const dialogRef = this.dialog.open(DialogEditAddressComponent);
    dialogRef.componentInstance.user = { ...this.user };
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.removeWhitespace(result);
        this.user.street = result.street;
        this.user.zipCode = result.zipCode;
        this.user.city = result.city;
        await this.updateUserAddress();
      }
    });
  }

  async updateUser() {
    await updateDoc(this.getSingleDocRef('users', this.user.id), {
      firstname: this.user.firstName,
      lastname: this.user.lastName,
      email: this.user.email,
      birthDate: this.user.birthDate
    });
  }

  async updateUserAddress() {
    await updateDoc(this.getSingleDocRef('users', this.user.id), {
      street: this.user.street,
      zipCode: this.user.zipCode,
      city: this.user.city,
    });
  }

  async saveNotes(notes: string) {
    await updateDoc(this.getSingleDocRef('users', this.user.id), {
      notes: notes
    });
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(this.firestore, colId, docId);
  }

  removeWhitespace(obj: any) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      }
    });
  }
}
