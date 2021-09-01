import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageAiteComponent } from './message-aite.component';

describe('MessageAiteComponent', () => {
  let component: MessageAiteComponent;
  let fixture: ComponentFixture<MessageAiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageAiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageAiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
