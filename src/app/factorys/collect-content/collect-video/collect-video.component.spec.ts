import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectVideoComponent } from './collect-video.component';

describe('CollectVideoComponent', () => {
  let component: CollectVideoComponent;
  let fixture: ComponentFixture<CollectVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
