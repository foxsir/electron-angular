import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContactCardComponent } from './user-contact-card.component';

describe('UserContactCardComponent', () => {
  let component: UserContactCardComponent;
  let fixture: ComponentFixture<UserContactCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContactCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContactCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
