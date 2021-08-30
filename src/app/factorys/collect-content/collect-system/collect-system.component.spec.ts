import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectSystemComponent } from './collect-system.component';

describe('CollectSystemComponent', () => {
  let component: CollectSystemComponent;
  let fixture: ComponentFixture<CollectSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
