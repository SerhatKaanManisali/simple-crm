import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadboardComponent } from './leadboard.component';

describe('LeadboardComponent', () => {
  let component: LeadboardComponent;
  let fixture: ComponentFixture<LeadboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
