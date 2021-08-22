import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRemarkComponent } from './set-remark.component';

describe('SetRemarkComponent', () => {
  let component: SetRemarkComponent;
  let fixture: ComponentFixture<SetRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetRemarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
