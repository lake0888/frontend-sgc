import { Component, Input, OnInit, inject } from '@angular/core';

import { CountryService } from 'src/app/services/modules/country/country/country.service';
import { CountryStateService } from 'src/app/services/modules/country/country_state/country_state.service';

import CountryState from 'src/app/api/util/country/contry_state';
import Country from 'src/app/api/util/country/country';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { ShareService } from 'src/app/services/share.service';
import JUtil from 'src/app/api/util/jutil';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  public countryList: Array<Country>;
  private countryService: CountryService;

  public countryStateList: Array<CountryState>;
  private countryStateService: CountryStateService;

  @Input() formGroupName: string;
  form!: FormGroup;

  public countryState: CountryState;
  subscription: Subscription;

  constructor(private rootFormGroup: FormGroupDirective, private shareService: ShareService) {
    this.formGroupName = "";

    this.countryList = new Array<Country>();
    this.countryService = inject(CountryService);

    this.countryStateList = new Array<CountryState>();
    this.countryStateService = inject(CountryStateService);

    this.countryState = new CountryState();

    this.subscription = this.shareService.getData().subscribe(
      (response: any) => {
        this.countryState = response;
      }
    );

  }

  
  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.findAllCountry();
  }

  private findAllCountry(): void {
    this.countryService.findByState_NotNull({ name: "" }).subscribe(
      (response: any) => {
        this.countryList = response;

        var country: Country = this.countryState.country;
        var indexCountry = JUtil.findElement(this.countryList, country);

        var index = (indexCountry != -1) ? indexCountry : 0;
        this.form.patchValue({
          country: this.countryList[index]
        });

        this.onChangeCountry();
      });
  }

  public onChangeCountry(): void {
    var code_country = this.form.get('country')?.value.code as number;
    this.countryStateService.findAllByCountryCode({ code: code_country }).subscribe(
      (response: any) => {
        this.countryStateList = response;

        var indexCountryState = JUtil.findElement(this.countryStateList, this.countryState);

        var index = (indexCountryState != -1) ? indexCountryState : 0;
        this.form.patchValue({ 
          countryState: this.countryStateList[index] 
        });
      }
    );
  }
}
