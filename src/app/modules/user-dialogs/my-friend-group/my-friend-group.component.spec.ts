import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFriendGroupComponent } from './my-friend-group.component';

describe('MyFriendGroupComponent', () => {
  let component: MyFriendGroupComponent;
  let fixture: ComponentFixture<MyFriendGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyFriendGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFriendGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
