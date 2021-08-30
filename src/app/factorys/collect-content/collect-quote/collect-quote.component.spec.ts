import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectQuoteComponent } from './collect-quote.component';

describe('CollectQuoteComponent', () => {
  let component: CollectQuoteComponent;
  let fixture: ComponentFixture<CollectQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
