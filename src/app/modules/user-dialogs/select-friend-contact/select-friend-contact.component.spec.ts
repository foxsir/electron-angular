import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFriendContactComponent } from './select-friend-contact.component';

describe('SelectFriendContactComponent', () => {
  let component: SelectFriendContactComponent;
  let fixture: ComponentFixture<SelectFriendContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectFriendContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFriendContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
