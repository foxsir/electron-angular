import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectTextComponent } from './collect-text.component';

describe('CollectTextComponent', () => {
  let component: CollectTextComponent;
  let fixture: ComponentFixture<CollectTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
