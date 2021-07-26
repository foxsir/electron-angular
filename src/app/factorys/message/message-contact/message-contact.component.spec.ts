import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageContactComponent } from './message-contact.component';

describe('MessageContactComponent', () => {
  let component: MessageContactComponent;
  let fixture: ComponentFixture<MessageContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
