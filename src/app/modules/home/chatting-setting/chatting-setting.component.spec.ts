import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattingSettingComponent } from './chatting-setting.component';

describe('ChattingSettingComponent', () => {
  let component: ChattingSettingComponent;
  let fixture: ComponentFixture<ChattingSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChattingSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChattingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
