import { TestBed } from '@angular/core/testing';

import { MessageDistributeService } from './message-distribute.service';

describe('MessageDistributeService', () => {
  let service: MessageDistributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageDistributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
