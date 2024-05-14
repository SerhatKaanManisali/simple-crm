import { Component, OnInit, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'
import { DialogEditUserComponent } from './dialog-edit-user/dialog-edit-user.component';
import { DialogEditAddressComponent } from './dialog-edit-address/dialog-edit-address.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  route: ActivatedRoute = inject(ActivatedRoute);
  dialog: MatDialog = inject(MatDialog);

  userId = '';
  user: User | null = null;

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.getUser();
  }

  async getUser() {
    await getDoc(doc(this.firestore, 'users', this.userId)).then((user: any) => {
      this.user = user.data();
    });
  }

  openUserEditor() {
    const dialogRef = this.dialog.open(DialogEditUserComponent);

    dialogRef.afterClosed().subscribe(async (result: any) => {

    });
  }

  openAddressEditor() {
    const dialogRef = this.dialog.open(DialogEditAddressComponent);

    dialogRef.afterClosed().subscribe(async (result: any) => {

    });
  }
}
