import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattingVoiceComponent } from './chatting-voice.component';

describe('ChattingVoiceComponent', () => {
    let component: ChattingVoiceComponent;
    let fixture: ComponentFixture<ChattingVoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [ChattingVoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(ChattingVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
