import { TestBed } from '@angular/core/testing';

import { SingleChattingCacheService } from './single-chatting-cache.service';

describe('SingleChattingCacheService', () => {
  let service: SingleChattingCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleChattingCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
