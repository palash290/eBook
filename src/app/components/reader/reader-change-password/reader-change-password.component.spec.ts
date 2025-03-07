import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderChangePasswordComponent } from './reader-change-password.component';

describe('ReaderChangePasswordComponent', () => {
  let component: ReaderChangePasswordComponent;
  let fixture: ComponentFixture<ReaderChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderChangePasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReaderChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
