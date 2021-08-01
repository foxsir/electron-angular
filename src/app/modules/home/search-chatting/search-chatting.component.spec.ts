import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChattingComponent } from './search-chatting.component';

describe('SearchChattingComponent', () => {
  let component: SearchChattingComponent;
  let fixture: ComponentFixture<SearchChattingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchChattingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChattingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
