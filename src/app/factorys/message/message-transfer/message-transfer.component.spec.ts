import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTransferComponent } from './message-transfer.component';

describe('MessageTransferComponent', () => {
  let component: MessageTransferComponent;
  let fixture: ComponentFixture<MessageTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
