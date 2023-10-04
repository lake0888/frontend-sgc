import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import Carrier from 'src/app/api/carrier/carrier';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';

import { CarrierService } from 'src/app/services/modules/carrier/carrier.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.css']
})
export class CarrierComponent implements OnInit {
  public carrierList: Array<Carrier>;
  private service: CarrierService;

  public carrier: Carrier;
  public kindDelete: number;

  //BREADCRUMB
  public breadcrumb: BreadCrumb;
  //ALERT
  public alert: Alert;

  //TABLE HEADER
  public columns: string[];

  //SHEARH AND PAGINATION
  public params: any;

  constructor(private shareService: ShareService) {
    this.carrierList = new Array<Carrier>();
    this.service = inject(CarrierService);

    this.carrier = new Carrier();

    this.kindDelete = 1;

    //BREADCRUMB
    this.breadcrumb = new BreadCrumb('Carrier', 'Manage the carrier module');
    this.breadcrumb.urls.push(new Url('Carrier', 'carrier'));
    //ALERT
    this.alert = new Alert();

    //TABLE HEADER
    this.columns = ['Name', 'Kind', 'Address', 'Phone', 'Email'];
    this.params = { filter: '', page: 0, size: '' }

    this.findAll(this.params);
  }

  ngOnInit(): void {  }

  public onOpenModal(carrier: any, mode: string): void {
      const container = document.getElementById('carrierContainer');

      if (mode === 'add' || mode === 'edit') {
        const tag_a = document.createElement('a');
        tag_a.style.display = 'none';
        
        if (mode === 'add') {
          this.carrier = new Carrier();
          tag_a.href = 'carrier/add';
        } else {
          this.carrier = carrier;
          tag_a.href = `carrier/${ this.carrier.id }/edit`;
        }

        container?.appendChild(tag_a);
        tag_a.click();
      } else if (mode === 'delete' || mode === 'deleteAll') {
        const button = document.createElement('button');
        button.setAttribute('data-bs-toggle', 'modal');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-bs-target', '#deleteModal');

        const message = document.getElementById('message')!;
        if (mode === 'delete') {
          this.carrier = carrier;
          this.kindDelete = 1;
          message.innerHTML = `Are you sure you want to delete carrier ${ this.carrier.name }?`;
        } else {
          this.kindDelete = 2;
          let cont = this.findCarrierSelecteds().length;
          if (cont > 0) {
            let text = (cont == 1) ? 'carrier' : 'carriers';
            message.innerHTML = `Are you sure you want to delete ${ cont } ${ text }?`;
          } else {
            this.alert.kindAlert = KindAlert.Info;
            this.alert.title = 'Info';
            this.alert.message = `There aren't any carriers selected`;
            return;
          }          
        }

        container?.appendChild(button);
        button.click();
      }
  }

  private findAll(params: any) {
    this.alert.onCleanAlert();
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.carrierList = response['content'];

          let pagination = {
            first: response['first'],
            last: response['last'],
            page: response['number'],
            numberOfElements: response['numberOfElements'],
            size: response['size'],
            totalElements: response['totalElements'],
            totalPages: response['totalPages']
          };

          this.shareService.sendData(pagination);
        } else{
          this.alert.kindAlert = KindAlert.Warning;
          this.alert.title = "Not found";
          this.alert.message = "There aren't any carriers";
        }
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteById(): void {
    document.getElementById('delete-form')?.click();
    this.service.deleteById(this.carrier.id).subscribe(
      (response: any) => {
        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The carrier ${ this.carrier.name } have been deleted`;
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteAllById(): void {
    document.getElementById('delete-form')?.click();
    this.service.deleteAllById({ listId: this.findCarrierSelecteds() }).subscribe(
      (response: any) => {
        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The carriers have been deleted`;
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public onSelectAll(flag: boolean): void {
    for (let carrier of this.carrierList) {
        carrier.checked = flag;
    }
  }

  public onSelected(size: any): void {
    this.params.size = size as number;
    this.findAll(this.params);
  }

  public onFilterChange(filter: any): void {
    this.params.filter = filter;
    this.findAll(this.params);
  }

  public onPageChange(page: any): void {
    this.params.page = page as number;
    this.findAll(this.params);
  }


  private findCarrierSelecteds(): Array<number> {
    let carrierListId = new Array<number>();
    for (let carrier of this.carrierList) {
      if (carrier.checked)
        carrierListId.push(carrier.id);
    }
    return carrierListId;
  }

}
