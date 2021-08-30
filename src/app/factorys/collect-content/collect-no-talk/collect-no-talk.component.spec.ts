import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectNoTalkComponent } from './collect-no-talk.component';

describe('CollectNoTalkComponent', () => {
  let component: CollectNoTalkComponent;
  let fixture: ComponentFixture<CollectNoTalkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectNoTalkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectNoTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
