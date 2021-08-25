import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmitMessageComponent } from './transmit-message.component';

describe('TransmitMessageComponent', () => {
  let component: TransmitMessageComponent;
  let fixture: ComponentFixture<TransmitMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmitMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmitMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
