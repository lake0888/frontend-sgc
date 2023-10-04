import { Component, OnInit, inject } from '@angular/core';
import { ProviderService } from 'src/app/services/modules/provider/provider.service';

import Provider from 'src/app/api/provider/provider';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Url from 'src/app/api/util/url';
import Alert from 'src/app/api/util/alert';
import JUtil from 'src/app/api/util/jutil';
import KindAlert from 'src/app/api/util/kindalert';
import { ShareService } from 'src/app/services/share.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  public providerList: Array<Provider>;
  private service: ProviderService;

  private provider: Provider;

  public breadcrumb: BreadCrumb;
  public alert: Alert;

  private params: any;

  public columns: Array<string>;

  public kindDelete: number;

  public selectAll!: boolean;

  constructor(private shareService: ShareService) {
    this.providerList = new Array<Provider>();
    this.service = inject(ProviderService);

    this.provider = new Provider();

    this.breadcrumb = new BreadCrumb('Provider', 'Manage the provider module');
    this.breadcrumb.urls.push(new Url('Provider', 'provider'));

    this.alert = new Alert();

    this.params = { filter: '', page: 0, size: 10 };

    this.columns = [ 'Name', 'Address', 'Phone', 'Email'];

    this.kindDelete = 1;
  }

  ngOnInit(): void {
    this.findAll(this.params);
  }

  public onOpenModal(provider: any, mode: string): void {
    const container = document.getElementById('providerContainer');
    if (mode === 'add' || mode === 'edit') {
      const tag_a = document.createElement('a');
      tag_a.style.display = 'none';

      if (mode === 'add') {
        this.provider = new Provider();
        tag_a.href = 'provider/add';
      } else {
        this.provider = provider;
        tag_a.href = `provider/${ this.provider.id }/edit`;
      }

      container?.appendChild(tag_a);
      tag_a.click();
    } else if (mode === 'delete' || mode === 'deleteAll') {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#deleteModal');

      const message = document.getElementById('message')!;
      
      if (mode === 'delete') {
        this.kindDelete = 1;
        this.provider = provider;
        message.innerHTML = `Are you sure you want to delete provider ${ provider.name }?`;
      } else {
        this.kindDelete = 2;

        var cont = JUtil.getListChecked(this.providerList).length;
        if (cont == 0) {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't ant provider selected`;
          return;
        } else {
          var text = (cont == 1) ? 'provider' : 'providers';
          message.innerHTML = `Are you sure you want to delete ${ cont } ${ text }`;
        }
      }

      container?.appendChild(button);
      button.click();
    }
  }

  private findAll(params: any): void {
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.providerList = response['content'];

          let pagination = {
            first: response['first'],
            last: response['last'],
            page: response['page'],
            numberOfElements: response['numberOfElements'],
            size: response['size'],
            totalElements: response['totalElements'],
            totalPages: response['totalPages']
          }

          this.shareService.sendData(pagination);
        } else {
          this.alert.kindAlert = KindAlert.Warning;
          this.alert.title = 'Warning';
          this.alert.message = `There aren't any provider`;
        }
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteById(): void {
    this.service.deleteById(this.provider.id).subscribe(
      (response: any) => {
        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = 'The provider have been deleted';

        document.getElementById('delete-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteAll(): void {
    this.service.deleteAllById({ listId: JUtil.getListChecked(this.providerList) }).subscribe(
      (response: any) => {
        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = 'The providers have been deleted';

        document.getElementById('delete-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public onFilterChange(filter: any): void {
    this.params.filter = filter;
    this.findAll(this.params);
  }

  public onPageSizeChange(size: any): void {
    this.params.size = size as number;
    this.findAll(this.params);
  }

  public onSelectAll(flag: boolean): void {
    for (let provider of this.providerList) {
      provider.checked = flag;
    }
  }

  public onPageChange(page: any): void {
    this.params.page = page as number;
    this.findAll(this.params);
  }
}
