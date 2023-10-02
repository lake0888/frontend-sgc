import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierPageComponent } from './carrier-page.component';

describe('CarrierPageComponent', () => {
  let component: CarrierPageComponent;
  let fixture: ComponentFixture<CarrierPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarrierPageComponent]
    });
    fixture = TestBed.createComponent(CarrierPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
