import { TestBed } from '@angular/core/testing';

import { SubfamilyService } from './subfamily.service';

describe('SubfamilyService', () => {
  let service: SubfamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubfamilyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
