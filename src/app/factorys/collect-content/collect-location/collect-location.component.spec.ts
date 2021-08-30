import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectLocationComponent } from './collect-location.component';

describe('CollectLocationComponent', () => {
  let component: CollectLocationComponent;
  let fixture: ComponentFixture<CollectLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
