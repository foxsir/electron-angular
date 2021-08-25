import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMergeMultipleComponent } from './message-merge-multiple.component';

describe('MessageMergeMultipleComponent', () => {
  let component: MessageMergeMultipleComponent;
  let fixture: ComponentFixture<MessageMergeMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageMergeMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageMergeMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
