import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectFactoryComponent } from './collect-factory.component';

describe('CollectFactoryComponent', () => {
  let component: CollectFactoryComponent;
  let fixture: ComponentFixture<CollectFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectFactoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
