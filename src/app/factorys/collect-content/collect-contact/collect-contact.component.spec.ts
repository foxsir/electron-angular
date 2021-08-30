import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectContactComponent } from './collect-contact.component';

describe('CollectContactComponent', () => {
  let component: CollectContactComponent;
  let fixture: ComponentFixture<CollectContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
