import { TestBed } from '@angular/core/testing';

import { GroupChattingCacheService } from './group-chatting-cache.service';

describe('GroupChattingCacheService', () => {
  let service: GroupChattingCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupChattingCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
