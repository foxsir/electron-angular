import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChattingSettingComponent } from './group-chatting-setting.component';

describe('GroupChattingSettingComponent', () => {
  let component: GroupChattingSettingComponent;
  let fixture: ComponentFixture<GroupChattingSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupChattingSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChattingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
