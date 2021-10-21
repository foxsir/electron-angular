import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMediaComponent } from './preview-media.component';

describe('PreviewMediaComponent', () => {
  let component: PreviewMediaComponent;
  let fixture: ComponentFixture<PreviewMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
