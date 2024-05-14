import { Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    RouterModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnDestroy {
  firestore = inject(Firestore);
  dialogAddUser: DialogAddUserComponent = inject(DialogAddUserComponent);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: RouterModule = inject(RouterModule);
  displayedColumns: string[] = [
    'name',
    'email',
    'phone'
  ];

  dataSource: {}[] = [];
  users$;
  users;

  constructor() {
    this.users$ = collectionData(collection(this.firestore, 'users'));
    if (this.users$) {
      this.users = this.users$.subscribe((users) => {
        users.forEach((user) => {
          user['birthDate'] = this.formatDate(user);
        });
        this.dataSource = users;
      });
    }
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
