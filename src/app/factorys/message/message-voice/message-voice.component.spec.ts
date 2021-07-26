import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageVoiceComponent } from './message-voice.component';

describe('MessageVoiceComponent', () => {
  let component: MessageVoiceComponent;
  let fixture: ComponentFixture<MessageVoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageVoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
