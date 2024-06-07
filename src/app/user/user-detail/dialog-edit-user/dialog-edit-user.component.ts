import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatDatepickerModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {
  userForm: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);

  user: User = {
    id: '',
    img: '',
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
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/.+@.+\..+/)]],
      birthDate: ['']
    });

    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }
}
