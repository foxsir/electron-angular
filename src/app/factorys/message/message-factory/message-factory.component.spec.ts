import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFactoryComponent } from './message-factory.component';

describe('MessageFactoryComponent', () => {
  let component: MessageFactoryComponent;
  let fixture: ComponentFixture<MessageFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFactoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
