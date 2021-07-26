import { TestBed } from '@angular/core/testing';

import { AlarmsProviderService } from './alarms-provider.service';

describe('AlarmsProviderService', () => {
  let service: AlarmsProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlarmsProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
