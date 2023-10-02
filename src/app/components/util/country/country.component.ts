import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';

import Country from 'src/app/api/util/country/country';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import { CountryService } from 'src/app/services/modules/country/country/country.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  public countryList: Array<Country>;
  private service: CountryService;

  public country: Country;
  public modelMode: boolean; //TRUE CREATE, FALSE EDIT
  public titleDialog: string;

  public form!: FormGroup;

  //TYPE OF DELETE BUTTON
  public kindDelete: number;
  public selectAll: boolean;

  //BREADCRUMB
  public breadcrumb: BreadCrumb;
  //ALTER
  public alert: Alert;

  //FEEDBACK
  feedBackCode: string;
  feedBackName: string;
  feedBackNationality: string;
  feedBackPhoneCode: string;

  //TABLE HEADER
  public columns: string[];

  //SEARCH AND PAGINATION
  private params: any;

  constructor(private shareService: ShareService) {
    this.countryList = new Array<Country>();
    this.service = inject(CountryService);

    this.country = new Country();
    this.modelMode = true; //TRUE CREATE, FALSE EDIT
    this.titleDialog = "Add Country";

    //TYPE OF DELETE BUTTON
    this.kindDelete = 1;
    this.selectAll = false;

    //BREADCRUMB
    this.breadcrumb = new BreadCrumb('Country', 'Manage the country module');
    this.breadcrumb.urls.push(new Url('Country', 'country'));
    //ALERT
    this.alert = new Alert();

    //FEEDBACK
    this.feedBackCode = "";
    this.feedBackName = "";
    this.feedBackNationality = "";
    this.feedBackPhoneCode = "";
    

    //TABLE HEADER
    this.columns = [ 'Code', 'Name', 'Nationality', 'Phone Code' ];

    //SEARCH AND PAGINATION
    this.params = { filter: "", page: 0, size: 10 }

    this.findAll(this.params)
  }

  ngOnInit(): void { 
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      nationality: new FormControl(null, Validators.required),
      phoneCode: new FormControl(null)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.country.id,
      code: this.country.code,
      name: this.country.name,
      nationality: this.country.nationality,
      phoneCode: this.country.phoneCode
    });
  }

  public onOpenModal(country: any, mode: string) {
    const container = document.getElementById("countryContainer");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    this.onCleanFeedBack();

    if (mode === 'add' || mode === 'edit') {
      button.setAttribute('data-bs-target', '#editModal');
      if (mode === 'add') {
        this.country = new Country();
        this.titleDialog = "Add Country";
        this.modelMode = true;
      } else {
        this.country = country;
        this.titleDialog = "Edit Country";
        this.modelMode = false;
      }

      this.updateForm();
    } else if (mode === 'delete' || mode === 'deleteAll') {
      button.setAttribute('data-bs-target', '#deleteModal');
      const element = document.getElementById('message')!;
      if (mode === 'delete') {
        this.country = country;
        this.kindDelete = 1;
        element.innerHTML = `Are you sure you want to delete country ${ country.name }?`;
      } else {
        let cont = this.countrySelecteds().length;
        if (cont > 0) {
          this.kindDelete = 2;
          let text: string = cont == 1 ? 'country' : 'countries';
          element.innerHTML = `Are you sure you want to delete ${ cont } ${ text }`;
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = "Info";
          this.alert.message = "There aren't any countries selected";
          return;
        }
      }
    }

    container?.appendChild(button);
    button.click();
  }

  private findAll(params: any) {    
    this.service.findAll(params).subscribe(
      (response: any) => {
        this.countryList = response['content'];

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
        this.selectAll = false;
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }      
    );
  }

  public save(): void {
    let params = this.getCountry();
    const formData: FormData = this.prepareFormData(params);

    this.service.save(formData).subscribe(
      (response: Country) => {
        this.country = response;
        this.findAll(this.params);
        this.form.reset();

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The country have been registered";

        document.getElementById("edit-form")?.click();
      }, (error: HttpErrorResponse) => {
        let message = error.error.message;
        this.updateFeedBack(message);

        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = message;
      }
    );
  }

  public updateById(countryId: number): void {
    let params = this.getCountry();
    const formData: FormData = this.prepareFormData(params);

    this.service.updateById(countryId, formData).subscribe(
      (response: any) => {
        this.country = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The country have been updated";
        document.getElementById("edit-form")?.click();
      }, (error: HttpErrorResponse) => {
        let message = error.error.message;
        this.updateFeedBack(message);

        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = message;
      }
    );
  }

  public deleteById(countryId: number): void {
    this.service.deleteById(countryId).subscribe(
      (response: any) => {
        this.country = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The country have been deleted";
        document.getElementById("delete-form")?.click();
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteAll(): void {
    let countryList = this.countrySelecteds();
    this.service.deleteAllById( { listId: countryList } ).subscribe(
      (response: any) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The countries have been deleted";
        document.getElementById("delete-form")?.click();
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getCountry(): any {
    let params = {
      code: this.form.get('code')?.value,
      name: this.form.get('name')?.value,
      nationality: this.form.get('nationality')?.value,
      phoneCode: this.form.get('phoneCode')?.value
    }
    return params;
  }

  private prepareFormData(country: any): FormData {
    const formData: FormData = new FormData();

    //ADD COUNTRY
    formData.append(
      'country',
      new Blob([JSON.stringify(country)], { type: 'application/json' })
    );

    return formData;
  }

  public onFilterChange(filter: string): void {
    this.params.filter = filter;
    this.findAll(this.params);
  }

  public onSelected(size: any): void {
    this.params.size = size as number;
    this.findAll(this.params);
  }

  public onSelectAll(flag: boolean): void {
    for (let country of this.countryList) {
      country.checked = flag;
    }
  }

  public onSetPage(page: any): void {
    this.params.page = page as number;
    this.findAll(this.params);
  }

  public countrySelecteds(): Array<number> {
    var countryList = new Array<number>();
    for (let country of this.countryList) {
      if (country.checked)
      countryList.push(country.id);
    }
    return countryList;
  }

  private updateFeedBack(message: string) {
    this.onCleanFeedBack();

    const code = document.querySelector("#editModal #code");
    code?.classList.remove("is-invalid");

    const name = document.querySelector("#editModal #name");
    name?.classList.remove("is-invalid");

    const nationality = document.querySelector("#editModal #nationality");
    nationality?.classList.remove("is-invalid");

    const phoneCode = document.querySelector("#editModal #phoneCode");
    phoneCode?.classList.remove("is-invalid");

    if(message.includes("phone")) {          
      phoneCode?.classList.add("is-invalid");
      this.feedBackPhoneCode = message;
    } else if (message.includes("code")) {
      code?.classList.add("is-invalid");
      this.feedBackCode = message;
    } else if(message.includes("name")) {          
      name?.classList.add("is-invalid");
      this.feedBackName = message;
    } else if(message.includes("nationality")) {          
      nationality?.classList.add("is-invalid");
      this.feedBackNationality = message;
    }
  }

  private onCleanFeedBack(): void {
    this.feedBackCode = "";
    this.feedBackName = "";
    this.feedBackNationality = ""
    this.feedBackPhoneCode = "";
  }

}
