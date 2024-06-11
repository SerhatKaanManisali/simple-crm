import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Lead } from '../../interfaces/lead.interface';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dialog-add-lead',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSelectModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './dialog-add-lead.component.html',
  styleUrls: ['./dialog-add-lead.component.scss']
})
export class DialogAddLeadComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  leadForm: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  users: string[] = [];
  filteredUsers!: Observable<string[]>;
  stages: string[] = ['Qualified', 'Contact made', 'Proposal made', 'Negotiations started'];

  lead: Lead = {
    title: '',
    description: '',
    person: '',
    company: '',
    value: 0,
    stage: ''
  }

  constructor() {
    this.leadForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
      person: [''],
      company: [''],
      value: [0],
      stage: [this.stages[0]]
    });
  }

  async ngOnInit() {
    await this.getUsers();
    this.filteredUsers = this.leadForm.get('person')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value || ''))
    );
  }

  async getUsers() {
    const usersRef = collection(this.firestore, 'users');
    const usersSnapshot = await getDocs(usersRef);
    this.users = usersSnapshot.docs.map(doc => {
      const userData = doc.data();
      return `${userData['firstName']} ${userData['lastName']}`;
    });
  }

  private _filterUsers(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.toLowerCase().includes(filterValue));
  }
}
