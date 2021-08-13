import { TestBed } from '@angular/core/testing';

import { QuoteMessageService } from './quote-message.service';

describe('QuoteMessageService', () => {
  let service: QuoteMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
