import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendGroupComponent } from './friend-group.component';

describe('FriendGroupComponent', () => {
    let component: FriendGroupComponent;
    let fixture: ComponentFixture<FriendGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [FriendGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(FriendGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
