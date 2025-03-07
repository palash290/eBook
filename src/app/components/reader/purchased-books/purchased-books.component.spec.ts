import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedBooksComponent } from './purchased-books.component';

describe('PurchasedBooksComponent', () => {
  let component: PurchasedBooksComponent;
  let fixture: ComponentFixture<PurchasedBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasedBooksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchasedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
