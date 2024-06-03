import { Component, Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-dialog-add-purchase',
  standalone: true,
  imports: [],
  templateUrl: './dialog-add-purchase.component.html',
  styleUrl: './dialog-add-purchase.component.scss'
})
export class DialogAddPurchaseComponent {
  dialog: MatDialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open
  }
}
