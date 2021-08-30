import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectAtComponent } from './collect-at.component';

describe('CollectAtComponent', () => {
  let component: CollectAtComponent;
  let fixture: ComponentFixture<CollectAtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectAtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
