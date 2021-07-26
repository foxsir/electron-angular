import { TestBed } from '@angular/core/testing';

import { ImService } from './im.service';

describe('ImService', () => {
  let service: ImService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
