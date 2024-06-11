import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddLeadComponent } from './dialog-add-lead/dialog-add-lead.component';
import { Lead } from '../interfaces/lead.interface';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-leadboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule],
  templateUrl: './leadboard.component.html',
  styleUrl: './leadboard.component.scss'
})
export class LeadboardComponent {
  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddLeadComponent);
    dialogRef.afterClosed().subscribe(async (result: Lead) => {
      if (result) {
        await addDoc(collection(this.firestore, 'leads'), result);
      }
    });
  }
}
