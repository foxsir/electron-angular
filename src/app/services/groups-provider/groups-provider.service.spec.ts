import { TestBed } from '@angular/core/testing';

import { GroupsProviderService } from './groups-provider.service';

describe('GroupsProviderService', () => {
  let service: GroupsProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupsProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
