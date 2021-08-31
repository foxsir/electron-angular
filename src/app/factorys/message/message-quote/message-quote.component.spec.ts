import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageQuoteComponent } from './message-quote.component';

describe('MessageQuoteComponent', () => {
  let component: MessageQuoteComponent;
  let fixture: ComponentFixture<MessageQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
