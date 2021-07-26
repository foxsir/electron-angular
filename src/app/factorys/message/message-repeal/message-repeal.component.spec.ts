import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRepealComponent } from './message-repeal.component';

describe('MessageRepealComponent', () => {
  let component: MessageRepealComponent;
  let fixture: ComponentFixture<MessageRepealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageRepealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageRepealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
