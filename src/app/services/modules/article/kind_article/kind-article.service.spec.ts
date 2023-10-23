import { TestBed } from '@angular/core/testing';

import { KindArticleService } from './kind-article.service';

describe('KindArticleService', () => {
  let service: KindArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KindArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
