import { Component, OnInit, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  route: ActivatedRoute = inject(ActivatedRoute);

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

  openAddressDialog() {

  }
}
