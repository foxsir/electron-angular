import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectRedEnvelopeComponent } from './collect-red-envelope.component';

describe('CollectRedEnvelopeComponent', () => {
  let component: CollectRedEnvelopeComponent;
  let fixture: ComponentFixture<CollectRedEnvelopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectRedEnvelopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectRedEnvelopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
