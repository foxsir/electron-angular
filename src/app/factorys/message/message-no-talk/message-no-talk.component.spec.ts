import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageNoTalkComponent } from './message-no-talk.component';

describe('MessageNoTalkComponent', () => {
  let component: MessageNoTalkComponent;
  let fixture: ComponentFixture<MessageNoTalkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageNoTalkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageNoTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
