import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLocationComponent } from './message-location.component';

describe('MessageLocationComponent', () => {
  let component: MessageLocationComponent;
  let fixture: ComponentFixture<MessageLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
