import { TestBed } from '@angular/core/testing';

import { CurrentChattingChangeService } from './current-chatting-change.service';

describe('CurrentChattingChangeService', () => {
  let service: CurrentChattingChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentChattingChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
