import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderOrderHistoryComponent } from './reader-order-history.component';

describe('ReaderOrderHistoryComponent', () => {
  let component: ReaderOrderHistoryComponent;
  let fixture: ComponentFixture<ReaderOrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderOrderHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReaderOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
