import { TestBed } from '@angular/core/testing';

import { TempMessageService } from './temp-message.service';

describe('TempMessageService', () => {
  let service: TempMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
