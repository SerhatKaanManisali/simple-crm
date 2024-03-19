import { Component, Injectable, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { User } from '../../interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, doc, addDoc } from '@angular/fire/firestore';


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
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);

  user: User = {
    firstName: '',
    lastName: '',
    birthDate: 12345,
    street: '',
    zipCode: 0,
    city: '',
  };

  loading: boolean = false;

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddUserComponent);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result && result.birthDate) {
        result.birthDate = result.birthDate.getTime();
        await this.addDoc(result);
      } else if (result) {
        await this.addDoc(result);
      }
    });
  }

  async addDoc(item: User) {
    this.loading = true;
    await addDoc(this.getUsersRef(), item)
      .then(() => this.loading = false)
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
