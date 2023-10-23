import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KindArticleComponent } from './kind-article.component';

describe('KindArticleComponent', () => {
  let component: KindArticleComponent;
  let fixture: ComponentFixture<KindArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KindArticleComponent]
    });
    fixture = TestBed.createComponent(KindArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
