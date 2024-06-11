import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, onSnapshot, updateDoc, doc, addDoc } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddLeadComponent } from './dialog-add-lead/dialog-add-lead.component';
import { Lead } from '../interfaces/lead.interface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-leadboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule, MatCardModule, DragDropModule],
  templateUrl: './leadboard.component.html',
  styleUrls: ['./leadboard.component.scss']
})
export class LeadboardComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);
  stages: string[] = ['Qualified', 'Contact made', 'Proposal made', 'Negotiations started'];
  leads: Lead[] = [];
  leadsByStage: { [key: string]: { leads: Lead[], totalValue: number } } = {};

  ngOnInit() {
    this.getLeads();
  }

  getLeads() {
    const leadsCollection = collection(this.firestore, 'leads');
    onSnapshot(leadsCollection, (snapshot) => {
      this.leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      this.groupLeadsByStage();
    });
  }

  groupLeadsByStage() {
    this.leadsByStage = {};
    for (let lead of this.leads) {
      if (!this.leadsByStage[lead.stage]) {
        this.leadsByStage[lead.stage] = { leads: [], totalValue: 0 };
      }
      this.leadsByStage[lead.stage].leads.push(lead);
      this.leadsByStage[lead.stage].totalValue += lead.value;
    }
  }

  async updateLeadStage(lead: Lead, newStage: string) {
    const leadDocRef = doc(this.firestore, `leads/${lead.id}`);
    await updateDoc(leadDocRef, { stage: newStage });
  }

  async drop(event: any, newStage: string) {
    if (event.previousContainer === event.container) return;

    const lead = event.previousContainer.data[event.previousIndex];
    await this.updateLeadStage(lead, newStage);

    this.removeLeadFromPreviousStage(lead, event.previousIndex);
    this.addLeadToNewStage(lead, newStage, event.currentIndex);

    this.groupLeadsByStage();
  }

  removeLeadFromPreviousStage(lead: Lead, previousIndex: number) {
    if (this.leadsByStage[lead.stage]) {
      this.leadsByStage[lead.stage].leads.splice(previousIndex, 1);
      this.leadsByStage[lead.stage].totalValue -= lead.value;
    }
  }

  addLeadToNewStage(lead: Lead, newStage: string, currentIndex: number) {
    lead.stage = newStage;
    if (!this.leadsByStage[newStage]) {
      this.leadsByStage[newStage] = { leads: [], totalValue: 0 };
    }
    this.leadsByStage[newStage].leads.splice(currentIndex, 0, lead);
    this.leadsByStage[newStage].totalValue += lead.value;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddLeadComponent);
    dialogRef.afterClosed().subscribe(async (result: Lead) => {
      if (result) {
        await addDoc(collection(this.firestore, 'leads'), result);
        this.getLeads();
      }
    });
  }
}
