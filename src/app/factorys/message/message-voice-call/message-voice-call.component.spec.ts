import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageVoiceCallComponent } from './message-voice-call.component';

describe('MessageVoiceCallComponent', () => {
  let component: MessageVoiceCallComponent;
  let fixture: ComponentFixture<MessageVoiceCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageVoiceCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageVoiceCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
