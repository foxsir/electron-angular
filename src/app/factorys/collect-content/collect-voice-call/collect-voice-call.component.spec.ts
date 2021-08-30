import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectVoiceCallComponent } from './collect-voice-call.component';

describe('CollectVoiceCallComponent', () => {
  let component: CollectVoiceCallComponent;
  let fixture: ComponentFixture<CollectVoiceCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectVoiceCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectVoiceCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
