import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectVoiceComponent } from './collect-voice.component';

describe('CollectVoiceComponent', () => {
  let component: CollectVoiceComponent;
  let fixture: ComponentFixture<CollectVoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectVoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
