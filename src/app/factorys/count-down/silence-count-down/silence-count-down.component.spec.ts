import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilenceCountDownComponent } from './silence-count-down.component';

describe('SilenceCountDownComponent', () => {
  let component: SilenceCountDownComponent;
  let fixture: ComponentFixture<SilenceCountDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SilenceCountDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SilenceCountDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
