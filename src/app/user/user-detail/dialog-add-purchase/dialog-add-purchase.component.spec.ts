import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPurchaseComponent } from './dialog-add-purchase.component';

describe('DialogAddPurchaseComponent', () => {
  let component: DialogAddPurchaseComponent;
  let fixture: ComponentFixture<DialogAddPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
