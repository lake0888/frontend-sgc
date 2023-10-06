import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import Bank from 'src/app/api/bank/bank';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import JUtil from 'src/app/api/util/jutil';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import { BankService } from 'src/app/services/modules/bank/bank/bank.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  public bankList: Array<Bank>;
  private service: BankService;
  private bank: Bank;

  public breadcrumb: BreadCrumb;
  public alert: Alert;
  public params: any;
  public kindDelete: number;
  public columns: string[];

  constructor(private shareService: ShareService) {
    this.bankList = new Array<Bank>();
    this.service = inject(BankService);
    this.bank = new Bank();

    this.breadcrumb = new BreadCrumb('Bank', 'Manage the bank module');
    this.breadcrumb.urls.push(new Url('Bank', 'bank'));

    this.alert = new Alert();
    this.params = { filter: '', page: 0, size: 10 };

    this.kindDelete = 1;
    this.columns = [ 'Code', 'Name', 'Swift', 'Phone', 'Email' ];
  }

  public ngOnInit(): void {
    this.findAll(this.params);
  }

  public onOpenModal(bank: any, mode: string): void {
    const container = document.getElementById('containerBank');

    if (mode === 'add' || mode === 'edit') {
      const link = document.createElement('a');
      link.style.display = 'none';

      if (mode === 'add') {
        this.bank = new Bank();
        link.href = 'bank/add';        
      } else {
        this.bank = bank;
        link.href = `bank/${ this.bank.id }/edit`;
      }

      container?.appendChild(link);
      link.click();
    } else if (mode === 'delete' || mode === 'deleteAll') {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#deleteModal');

      const element = document.getElementById('message')!;
      if (mode === 'delete') {
        this.kindDelete = 1;
        this.bank = bank;
        element.innerHTML = `Are you sure you want to delete bank ${ this.bank.code }?`;
      } else {
        this.kindDelete = 2;
        let cont = JUtil.getListChecked(this.bankList).length;
        if (cont != 0) {
          let text = (cont == 1) ? 'bank' : 'banks';
          element.innerHTML = `Are you sure you want to delete ${ cont } ${ text }?`;
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There arent't any bank selected`;
          return;
        }
      }
      container?.appendChild(button);
      button.click();
    }
  }

  private findAll(params: any) {
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.bankList = response['content']; 

          let pagination = {
            first: response['first'],
            last: response['last'],
            page: response['number'],
            numberOfElements: response['numberOfElements'],
            size: response['size'],
            totalElements: response['totalElements'],
            totalPages: response['totalPages']
          }

          this.shareService.sendData(pagination);
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't any bank`;
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
    this.service.deleteById(this.bank.id).subscribe(
      (response: any) => {
        this.bank = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The bank ${ this.bank.code } have been deleted`;

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
    this.service.deleteAllById({ listId: JUtil.getListChecked(this.bankList) }).subscribe(
      (response: any) => {
        this.bank = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The banks have been deleted`;

        document.getElementById('delete-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public onChangeFilter(filter: any): void {
    this.params.filter = filter;
    this.findAll(this.params);
  }

  public onChangePageSize(size: any): void {
    this.params.size = size as number;
    this.findAll(this.params);
  }
  
  public onSelectAll(flag: boolean): void {
    JUtil.onSelectAll(this.bankList, flag);
  }

  public onPageChange(page: any): void {
    this.params.page = page as number;
    this.findAll(this.params);
  }

}
