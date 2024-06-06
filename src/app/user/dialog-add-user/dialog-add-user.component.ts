import { Component, Injectable, inject, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { User } from '../../interfaces/user.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, doc, addDoc, updateDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);
  userForm: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);

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

  loading: boolean = false;
  isScreenSmall = window.innerWidth < 400;

  constructor() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/.+@.+\..+/)]],
      phone: [''],
      birthDate: [''],
      street: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isScreenSmall = window.innerWidth < 400;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddUserComponent);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result && result.birthDate) {
        result.birthDate = result.birthDate.getTime();
        this.removeWhitespace(result);
        await this.addDoc(result);
      } else if (result) {
        this.removeWhitespace(result);
        await this.addDoc(result);
      }
    });
  }

  async addDoc(user: User) {
    this.loading = true;
    await addDoc(this.getUsersRef(), user).then(async (userInfo) => {
      this.loading = false;
      await updateDoc(this.getSingleDocRef('users', userInfo.id), {
        id: userInfo.id,
      });
    });
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
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
