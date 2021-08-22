import { TestBed } from '@angular/core/testing';

import { SwitchChatService } from './switch-chat.service';

describe('SwitchChatService', () => {
  let service: SwitchChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwitchChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
