import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSilenceComponent } from './user-silence.component';

describe('UserSilenceComponent', () => {
  let component: UserSilenceComponent;
  let fixture: ComponentFixture<UserSilenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSilenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSilenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
