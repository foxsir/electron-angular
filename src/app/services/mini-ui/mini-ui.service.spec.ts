import { TestBed } from '@angular/core/testing';

import { MiniUiService } from './mini-ui.service';

describe('MiniUiService', () => {
  let service: MiniUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiniUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
