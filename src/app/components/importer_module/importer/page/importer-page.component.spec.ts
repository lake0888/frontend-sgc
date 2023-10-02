import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImporterPageComponent } from './importer-page.component';

describe('ImporterPageComponent', () => {
  let component: ImporterPageComponent;
  let fixture: ComponentFixture<ImporterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImporterPageComponent]
    });
    fixture = TestBed.createComponent(ImporterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
