import { TestBed } from '@angular/core/testing';

import { CountryStateService } from './country_state.service';

describe('CountrystateService', () => {
  let service: CountryStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
