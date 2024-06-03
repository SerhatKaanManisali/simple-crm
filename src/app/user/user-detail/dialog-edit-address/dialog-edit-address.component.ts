import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../../interfaces/user.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-edit-address',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './dialog-edit-address.component.html',
  styleUrl: './dialog-edit-address.component.scss'
})
export class DialogEditAddressComponent {
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

  constructor() {
    this.userForm = this.formBuilder.group({
      street: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required]
    });

    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }
}
