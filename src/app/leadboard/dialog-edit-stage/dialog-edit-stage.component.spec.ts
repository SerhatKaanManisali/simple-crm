import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditStageComponent } from './dialog-edit-stage.component';

describe('DialogEditStageComponent', () => {
  let component: DialogEditStageComponent;
  let fixture: ComponentFixture<DialogEditStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditStageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
