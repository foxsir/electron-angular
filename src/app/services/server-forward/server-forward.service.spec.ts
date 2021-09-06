import { TestBed } from '@angular/core/testing';

import { ServerForwardService } from './server-forward.service';

describe('ServerForwardService', () => {
  let service: ServerForwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerForwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
