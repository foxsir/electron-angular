import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RedBagComponent} from './red-bag.component';

describe('RedBagComponent', () => {
  let component: RedBagComponent;
  let fixture: ComponentFixture<RedBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedBagComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
