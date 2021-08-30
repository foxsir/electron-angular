import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectFileComponent } from './collect-file.component';

describe('CollectFileComponent', () => {
  let component: CollectFileComponent;
  let fixture: ComponentFixture<CollectFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
