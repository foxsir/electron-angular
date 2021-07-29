import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBackComponent } from './message-back.component';

describe('MessageBackComponent', () => {
  let component: MessageBackComponent;
  let fixture: ComponentFixture<MessageBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
