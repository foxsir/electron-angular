import { TestBed } from '@angular/core/testing';

import { MessageRoamService } from './message-roam.service';

describe('MessageRoamService', () => {
  let service: MessageRoamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageRoamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
