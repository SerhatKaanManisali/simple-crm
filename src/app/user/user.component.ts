import { AfterViewInit, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    RouterModule,
    MatMenuModule,
    MatSortModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnDestroy, AfterViewInit {
  firestore = inject(Firestore);
  dialogAddUser: DialogAddUserComponent = inject(DialogAddUserComponent);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: RouterModule = inject(RouterModule);
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'more-options'
  ];

  dataSource = new MatTableDataSource();
  users$;
  users;

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.users$ = collectionData(collection(this.firestore, 'users'));
    if (this.users$) {
      this.users = this.users$.subscribe((users) => {
        users.forEach((user) => {
          user['fullName'] = `${user['firstName']} ${user['lastName']}`;
          user['birthDate'] = this.formatDate(user);
        });
        this.dataSource.data = users;
        this.dataSource.sort = this.sort;
      });
    }
  }

  async deleteUser(userId: string) {
    await deleteDoc(doc(this.firestore, 'users', userId));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.users) {
      this.users.unsubscribe();
    }
  }

  formatDate(user: any) {
    return new Date(user['birthDate']).toLocaleDateString();
  }
}
