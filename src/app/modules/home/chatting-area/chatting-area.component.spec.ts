import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattingAreaComponent } from './chatting-area.component';

describe('ChattingAreaComponent', () => {
  let component: ChattingAreaComponent;
  let fixture: ComponentFixture<ChattingAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChattingAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChattingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
