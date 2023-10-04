import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { CountryService } from 'src/app/services/modules/country/country/country.service';
import { CountryStateService } from 'src/app/services/modules/country/country_state/country_state.service';
import { ShareService } from 'src/app/services/share.service';

import CountryState from 'src/app/api/util/country/contry_state';
import Country from 'src/app/api/util/country/country';
import KindAlert from 'src/app/api/util/kindalert';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import JUtil from 'src/app/api/util/jutil';
import Url from 'src/app/api/util/url';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Alert from 'src/app/api/util/alert';

@Component({
  selector: 'app-country-state',
  templateUrl: './country-state.component.html',
  styleUrls: ['./country-state.component.css']
})
export class CountryStateComponent implements OnInit {
  public countryStateList: Array<CountryState>;
  private service: CountryStateService;

  public countryList: Array<Country>;
  private countryService: CountryService;

  public countryState: CountryState;
  public titleDialog: string;
  public modelMode: boolean;

  public kindDelete: number;

  //BREADCRUMB
  public breadcrumb: BreadCrumb;
  //ALERT
  public alert: Alert;

  //TABLE HEADER
  public columns: string[];

  //SHARE AND PAGINATION
  public params: any;

  //FEEDBACK
  public feedBackName: string;

  public form!: FormGroup;

  constructor(private shareService: ShareService) {
    this.countryStateList = new Array<CountryState>();
    this.service = inject(CountryStateService);

    this.countryList = new Array<Country>();
    this.countryService = inject(CountryService);

    this.countryState = new CountryState();
    this.titleDialog = "Add Country State";
    this.modelMode = true;

    this.kindDelete = 1;


    //BREADCRUMB
    this.breadcrumb = new BreadCrumb('State', 'Manage the country state module')
    this.breadcrumb.urls.push(new Url('Country State', 'countrystate'));
    //ALERT
    this.alert = new Alert();

    //TABLE HEADER
    this.columns = [ 'Name', 'Code', 'Country', 'Phone Code' ];

    //FEEDBACK
    this.feedBackName = "";

    //CHARE AND PAGINATION
    this.params = { filter: "", page: 0, size: 10 };
    this.findAll(this.params);

    this.findAllCountry();
  }

  ngOnInit(): void { 
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.countryState.id,
      name: this.countryState.name,
      country: this.countryState.country
    });
  }

  public onOpenModal(countryState: any, mode: string): void {
    this.onCleanFeedBack();
    const container = document.getElementById("countryStateContainer");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add' || mode === 'edit') {
      button.setAttribute('data-bs-target', '#editModal');
      var index = 0;
      if (mode === 'add') {
        this.countryState = new CountryState();
        this.modelMode = true;
        this.titleDialog = "Add Country State";

        if (this.countryList.length == 0) {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't any country created`;
          return;
        }
      } else {
        this.countryState = countryState;
        this.modelMode = false;
        this.titleDialog = "Edit Country State";

        var indexEdit = JUtil.findElement(this.countryList, this.countryState.country);
        index = (indexEdit != -1) ? indexEdit : 0;
      }

      this.updateForm();
      this.form.patchValue({
        country: this.countryList[index]
      });
    } else if (mode === 'delete' || mode === 'deleteAll') {
      button.setAttribute('data-bs-target', '#deleteModal');
      const element = document.getElementById("message")!;
      if (mode === 'delete') {
        this.countryState = countryState;
        this.kindDelete = 1;
        element.innerHTML =  `Are you sure you want to delete the Country State ${ this.countryState.name }?`;
      } else {
        this.kindDelete = 2;
        let cont = this.countryStateSelected().length;
        if (cont > 0) {
          let text = (cont == 1) ? 'country state' : 'country states';
          element.innerHTML = `Are you sure you want to delete ${ cont } ${ text }?`;
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = "Info";
          this.alert.message = "There aren't any country state selected";
          return;
        }
      }
    }

    container?.appendChild(button);
    button.click();
  }

  private findAll(params: any): void {
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.countryStateList = response['content'];

          let params: any = {
            first: response['first'],
            last: response['last'],
            page: response['number'],
            numberOfElements: response['numberOfElements'],
            size: response['size'],
            totalElements: response['totalElements'],
            totalPages: response['totalPages']
          }

          this.shareService.sendData(params);
        } else {
          this.alert.kindAlert = KindAlert.Warning;
          this.alert.title = 'Warning';
          this.alert.message = `There aren't any country state`;
        }
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public save(): void {
    let params = this.getCountryState();
    const formData: FormData = this.prepareFormData(params);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.countryState = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The Country State have been register";

        document.getElementById('edit-form')?.click();
      }, (error: HttpErrorResponse) => {
        let message = error.error.message;
        this.updateFeedBack(message);

        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = message
      }
    );
  }

  public updateById(): void {
    let params = this.getCountryState();
    const formData: FormData = this.prepareFormData(params);

    this.service.updateById(this.countryState.id, formData).subscribe(
      (response: any) => {
        this.countryState = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The Country State have been updated";

        document.getElementById('edit-form')?.click();
      }, (error: HttpErrorResponse) => {
        let message = error.error.message;
        this.updateFeedBack(message);

        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = message
      }
    );
  }

  public deleteById(): void {
    this.service.deleteById(this.countryState.id).subscribe(
      (response: any) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The Country State have been deleted";
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
    document.getElementById('delete-form')?.click();
  }

  public deleteAll(): void {
    var countryStateList = this.countryStateSelected();
    this.service.deleteAllById({ listId: countryStateList }).subscribe(
      (response: any) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The Country States have been deleted";
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
    document.getElementById('delete-form')?.click();
  }

  private getCountryState(): any {
    let params = {
      name: this.form.get('name')?.value,
      country: this.form.get('country')?.value
    }
    return params;
  }

  private prepareFormData(countryState: any): FormData {
    const formData: FormData = new FormData();
    //ADD COUNTRY STATE
    formData.append(
      'countryState',
      new Blob([JSON.stringify(countryState)], { type: 'application/json' })
    );
    return formData
  }

  private updateFeedBack(message: string): void {
    this.onCleanFeedBack();

    const name = document.querySelector("#editModal #name");
    name?.classList.remove("is-invalid", "is-valid");

    if (message.includes("name")) {
      name?.classList.add("is-invalid");
      this.feedBackName = message;
    }
  }

  private onCleanFeedBack() {
    this.feedBackName = "";
  }

  public onSizePageChange(size: any): void {
    this.params.size = size as number;
    this.findAll(this.params);
  }

  public onFilterChange(filter: string): void {
    this.params.page = 0;
    this.params.filter = filter;
    this.findAll(this.params);
  }

  public onSelectAll(flag: boolean): void {
    for (let countryState of this.countryStateList) {
      countryState.checked = flag;
    }
  }

  public onPageChange(page: any): void {
    this.params.page = page as number;
    this.findAll(this.params);
  }

  public onChange(flag: boolean): void {
    console.log(flag);
  }

  public countryStateSelected(): Array<number> {
    let countryStateList = new Array<number>();
    for (let countryState of this.countryStateList) {
      if (countryState.checked)
        countryStateList.push(countryState.id);
    }
    return countryStateList;
  }

  private findAllCountry(): void {
    this.countryService.findAllByName("").subscribe(
      (response: any) => {
        this.countryList = response;

      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );  
  }

}
