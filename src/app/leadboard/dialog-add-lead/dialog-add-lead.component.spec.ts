import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddLeadComponent } from './dialog-add-lead.component';

describe('DialogAddLeadComponent', () => {
  let component: DialogAddLeadComponent;
  let fixture: ComponentFixture<DialogAddLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
