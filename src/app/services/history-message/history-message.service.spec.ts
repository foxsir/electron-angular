import { TestBed } from '@angular/core/testing';

import { HistoryMessageService } from './history-message.service';

describe('HistoryMessageService', () => {
  let service: HistoryMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
