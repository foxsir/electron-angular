import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedPocketComponent } from './red-pocket.component';

describe('RedPocketComponent', () => {
    let component: RedPocketComponent;
    let fixture: ComponentFixture<RedPocketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [RedPocketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(RedPocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
