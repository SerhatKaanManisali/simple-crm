import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-edit-component',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, MatDialogModule],
  templateUrl: './dialog-edit-component.component.html',
  styleUrls: ['./dialog-edit-component.component.scss']
})
export class DialogEditComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { label: string, displayLabel: string, value: string | number, image: string }
  ) { }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data.value);
  }
}
