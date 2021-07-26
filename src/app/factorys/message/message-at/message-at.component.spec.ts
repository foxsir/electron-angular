import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageAtComponent } from './message-at.component';

describe('MessageAtComponent', () => {
  let component: MessageAtComponent;
  let fixture: ComponentFixture<MessageAtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageAtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
