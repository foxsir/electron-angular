import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTabsComponent } from './group-tabs.component';

describe('GroupTabsComponent', () => {
  let component: GroupTabsComponent;
  let fixture: ComponentFixture<GroupTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
