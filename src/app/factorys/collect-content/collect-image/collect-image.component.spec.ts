import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectImageComponent } from './collect-image.component';

describe('CollectImageComponent', () => {
  let component: CollectImageComponent;
  let fixture: ComponentFixture<CollectImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
