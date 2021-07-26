import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRedEnvelopeComponent } from './message-red-envelope.component';

describe('MessageRedEnvelopeComponent', () => {
  let component: MessageRedEnvelopeComponent;
  let fixture: ComponentFixture<MessageRedEnvelopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageRedEnvelopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageRedEnvelopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
