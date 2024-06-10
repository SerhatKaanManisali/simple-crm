import { AfterViewInit, Component, OnDestroy, OnInit, HostListener, ViewChild, inject } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnDestroy, AfterViewInit, OnInit {
  firestore = inject(Firestore);
  dialogAddUser: DialogAddUserComponent = inject(DialogAddUserComponent);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: RouterModule = inject(RouterModule);
  displayedColumns: string[] = [
    'name',
    'city',
    'birthDate',
    'more-options'
  ];

  dataSource = new MatTableDataSource();
  users$;
  users;
  isScreenWide = window.innerWidth > 425;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isScreenWide = window.innerWidth > 425;
    this.updateDisplayedColumns();
  }

  updateDisplayedColumns() {
    if (this.isScreenWide) {
      this.displayedColumns = ['name', 'city', 'birthDate', 'more-options'];
    } else {
      this.displayedColumns = ['name', 'city', 'more-options'];
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async deleteUser(userId: string) {
    await deleteDoc(doc(this.firestore, 'users', userId));
  }

  ngOnInit() {
    this.updateDisplayedColumns();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
