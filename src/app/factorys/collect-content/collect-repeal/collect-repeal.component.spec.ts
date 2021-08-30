import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectRepealComponent } from './collect-repeal.component';

describe('CollectRepealComponent', () => {
  let component: CollectRepealComponent;
  let fixture: ComponentFixture<CollectRepealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectRepealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectRepealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
