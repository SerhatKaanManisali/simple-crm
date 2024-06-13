import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Lead } from '../interfaces/lead.interface';
import { LeadDetailComponent } from '../leadboard/lead-detail/lead-detail.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-completed-leads',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    LeadDetailComponent,
    MatDialogModule
  ],
  templateUrl: './completed-leads.component.html',
  styleUrls: ['./completed-leads.component.scss']
})
export class CompletedLeadsComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);
  displayedColumns: string[] = ['title', 'status', 'value', 'reopen'];
  dataSource = new MatTableDataSource<Lead>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const leadsCollection = collection(this.firestore, 'leads');
    onSnapshot(leadsCollection, (snapshot) => {
      const leadsData: Lead[] = snapshot.docs.map(doc => ({
        ...doc.data() as Omit<Lead, 'id'>,
        id: doc.id
      }));
      this.dataSource.data = leadsData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data: any, header) => {
        switch (header) {
          case 'status': return data.status;
          default: return data[header];
        }
      };
      const sortState: Sort = { active: 'status', direction: 'asc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async reopenLead(id: string) {
    const leadDocRef = doc(this.firestore, 'leads', id);
    await updateDoc(leadDocRef, { status: 'open' });
  }

  openLeadDetail(lead: Lead) {
    const dialogRef = this.dialog.open(LeadDetailComponent, {
      data: lead
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const index = this.dataSource.data.findIndex(item => item.id === lead.id);
        if (index > -1) {
          this.dataSource.data[index] = { ...lead, ...result };
          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });
  }
}
