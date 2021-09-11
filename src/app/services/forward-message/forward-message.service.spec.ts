import { TestBed } from '@angular/core/testing';

import { ForwardMessageService } from './forward-message.service';

describe('ForwardMessageService', () => {
  let service: ForwardMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForwardMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
