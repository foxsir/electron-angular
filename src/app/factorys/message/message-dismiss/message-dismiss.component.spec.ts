import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDismissComponent } from './message-dismiss.component';

describe('MessageDismissComponent', () => {
  let component: MessageDismissComponent;
  let fixture: ComponentFixture<MessageDismissComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageDismissComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDismissComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
