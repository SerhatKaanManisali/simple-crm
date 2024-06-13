import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedLeadsComponent } from './completed-leads.component';

describe('CompletedLeadsComponent', () => {
  let component: CompletedLeadsComponent;
  let fixture: ComponentFixture<CompletedLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedLeadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompletedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
