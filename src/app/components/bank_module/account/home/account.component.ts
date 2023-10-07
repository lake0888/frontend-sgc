import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Bank from 'src/app/api/bank/bank';
import BankAccount from 'src/app/api/bank/bank_account';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Coin from 'src/app/api/util/coin/coin';
import JUtil from 'src/app/api/util/jutil';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import { BankService } from 'src/app/services/modules/bank/bank/bank.service';
import { BankAccountService } from 'src/app/services/modules/bank/bank_account/bank-account.service';
import { CoinService } from 'src/app/services/modules/coin/coin.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public accountList: Array<BankAccount>;
  private service: BankAccountService;
  private account: BankAccount;

  public coinList: Array<Coin>;
  private coinService: CoinService;

  public bankList: Array<Bank>;
  private bankService: BankService;

  public breadcrumb: BreadCrumb;
  public alert: Alert;

  form!: FormGroup;

  public kindDelete: number;
  public titleDialog: string;
  public params: any;
  public columns: string[];
  public modelMode: boolean;

  constructor(private shareService: ShareService) {
    this.accountList = new Array<BankAccount>();
    this.service = inject(BankAccountService);
    this.account = new BankAccount();

    this.coinList = new Array<Coin>();
    this.coinService = inject(CoinService);

    this.bankList = new Array<Bank>();
    this.bankService = inject(BankService);

    this.kindDelete = 1;
    this.titleDialog = '';
    this.modelMode = true;

    this.breadcrumb = new BreadCrumb('Bank Account', 'Manage the bank account module');
    this.breadcrumb.urls.push(new Url('Bank account', 'account'));

    this.alert = new Alert();
    this.params = { filter: '', page: 0, size: 10 };
    this.columns = ['Number', 'Iban', 'Coin', 'Bank'];
  }

  ngOnInit(): void {
    this.initForm();
    this.findAll(this.params);

    this.findAllCoin();
    this.findAllBank();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      number: new FormControl(null, Validators.required),
      iban: new FormControl(null),
      coin: new FormControl(null, Validators.required),
      bank: new FormControl(null, Validators.required)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.account.id,
      number: this.account.number,
      iban: this.account.iban,
      coin: this.account.coin,
      bank: this.account.bank
    });
  }

  public onOpenModal(account: any, mode: string): void {
    const container = document.getElementById('accountContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add' || mode === 'edit') {
      if (this.coinList.length == 0) {
        this.alert.kindAlert = KindAlert.Info;
        this.alert.title = 'Info';
        this.alert.message = `There aren't any coin registered`;
        return;
      }

      if (this.bankList.length == 0) {
        this.alert.kindAlert = KindAlert.Info;
        this.alert.title = 'Info';
        this.alert.message = `There aren't any bank registered`;
        return;
      }

      button.setAttribute('data-bs-target', '#editModal');

      if (mode === 'add') {
        this.account = new BankAccount();
        this.titleDialog = 'Add bank account';
        this.modelMode = true;
      } else {
        this.account = account;
        this.titleDialog = 'Edit bank account';
        this.modelMode = false;
      }
      this.updateForm();

      var indexCoin = JUtil.findElement(this.coinList, this.account.coin);
      indexCoin = (indexCoin != -1) ? indexCoin : 0;

      var indexBank = JUtil.findElement(this.bankList, this.account.bank);
      indexBank = (indexBank != -1) ? indexBank : 0;

      this.form.patchValue({
        coin: this.coinList[indexCoin],
        bank: this.bankList[indexBank]
      });
      
    } else if (mode === 'delete' || mode === 'deleteAll') {
      button.setAttribute('data-bs-target', '#deleteModal');
      const element = document.getElementById('message')!;

      if (mode === 'delete') {
        this.kindDelete = 1;
        this.account = account;

        element.innerHTML = `Are you sure you want to delete the bank account ${ this.account.number }?`;
      } else {
        this.kindDelete = 2;
        let cont = JUtil.getListChecked(this.accountList).length;

        if (cont != 0) {
          let text = (cont == 1) ? 'account' : 'accounts';
          element.innerHTML = `Are you sure you want to delete ${ cont } ${ text }?`;
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't any bank account selected`;
          return;
        }
      }
    }
    container?.appendChild(button);
    button.click();
  }

  private findAll(params: any): void {
    this.accountList.slice(0);
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.accountList = response['content'];

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
        }
        /* else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't any bank account`;
        } */
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public save(): void {
    const account = this.getAccount();
    const formData = this.prepareFormData(account);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.account = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The bank account ${ this.account.number } have been registered`;

        document.getElementById('edit-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public updateById(): void {
    const account = this.getAccount();
    const formData = this.prepareFormData(account);

    this.service.updateById(this.account.id, formData).subscribe(
      (response: any) => {
        this.account = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The bank account ${ this.account.number } have been updated`;

        document.getElementById('edit-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteById(): void {
    this.service.deleteById(this.account.id).subscribe(
      (response: any) => {
        this.account = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The bank account ${ this.account.number } have been deleted`;

        document.getElementById('delete-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteAllById(): void {
    this.service.deleteAllById({ listId: JUtil.getListChecked(this.accountList) }).subscribe(
      (response: any) => {
        this.account = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The bank accounts have been deleted`;

        document.getElementById('delete-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getAccount(): any {
    let account = {
      number: this.form.get('number')?.value,
      iban: this.form.get('iban')?.value,
      coin: this.form.get('coin')?.value,
      bank: this.form.get('bank')?.value
    };
    return account;
  }

  private prepareFormData(account: any): FormData {
    const formData: FormData = new FormData();
    //ADD ACCOUNT
    formData.append(
      'account',
      new Blob([JSON.stringify(account)], { type: 'application/json' })
    );
    return formData;
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
    JUtil.onSelectAll(this.accountList, flag);
  }

  private findAllCoin(): void {
    this.coinService.findAllCoin({ name: '' }).subscribe(
      (response: any) => {
        this.coinList = response;
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private findAllBank(): void {
    this.bankService.findAllBank({ filter: '' }).subscribe(
      (response: any) => {
        this.bankList = response;
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }
}
