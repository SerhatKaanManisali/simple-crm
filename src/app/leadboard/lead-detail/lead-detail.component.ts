import { Component, Inject, inject } from '@angular/core';
import { Lead } from '../../interfaces/lead.interface';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Firestore, updateDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.scss']
})
export class LeadDetailComponent {
  leadForm: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  firestore: Firestore = inject(Firestore);
  dialogRef: MatDialogRef<LeadDetailComponent> = inject(MatDialogRef);

  stages: string[] = ['Qualified', 'Contact made', 'Proposal made', 'Negotiations started'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Lead) {
    this.leadForm = this.formBuilder.group({
      title: [data.title, [Validators.required]],
      description: [data.description],
      person: [data.person],
      company: [data.company],
      stage: [data.stage],
      value: [data.value, [Validators.min(0)]]
    });
  }

  async save() {
    const leadDocRef = doc(this.firestore, 'leads', this.data.id);
    await updateDoc(leadDocRef, this.leadForm.value);
    this.dialogRef.close(this.leadForm.value);
  }
}
