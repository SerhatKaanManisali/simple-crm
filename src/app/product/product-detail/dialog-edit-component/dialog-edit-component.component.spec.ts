import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditComponentComponent } from './dialog-edit-component.component';

describe('DialogEditComponentComponent', () => {
  let component: DialogEditComponentComponent;
  let fixture: ComponentFixture<DialogEditComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
