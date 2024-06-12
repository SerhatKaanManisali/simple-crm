import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-edit-stage',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './dialog-edit-stage.component.html',
  styleUrl: './dialog-edit-stage.component.scss'
})
export class DialogEditStageComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditStageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stageName: string }
  ) { }
}
