import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MySignatureComponent} from './my-signature.component';

describe('MySignatureComponent', () => {
  let component: MySignatureComponent;
  let fixture: ComponentFixture<MySignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MySignatureComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
