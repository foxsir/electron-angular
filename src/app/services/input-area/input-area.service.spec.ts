import { TestBed } from '@angular/core/testing';

import { InputAreaService } from './input-area.service';

describe('InputAreaService', () => {
  let service: InputAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
