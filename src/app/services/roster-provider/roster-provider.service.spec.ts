import { TestBed } from '@angular/core/testing';

import { RosterProviderService } from './roster-provider.service';

describe('RosterProviderService', () => {
  let service: RosterProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RosterProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
