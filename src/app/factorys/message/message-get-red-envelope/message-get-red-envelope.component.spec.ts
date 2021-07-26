import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageGetRedEnvelopeComponent } from './message-get-red-envelope.component';

describe('MessageGetRedEnvelopeComponent', () => {
  let component: MessageGetRedEnvelopeComponent;
  let fixture: ComponentFixture<MessageGetRedEnvelopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageGetRedEnvelopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageGetRedEnvelopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
