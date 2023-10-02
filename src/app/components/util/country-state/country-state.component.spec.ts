import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryStateComponent } from './country-state.component';

describe('CountryStateComponent', () => {
  let component: CountryStateComponent;
  let fixture: ComponentFixture<CountryStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryStateComponent]
    });
    fixture = TestBed.createComponent(CountryStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
