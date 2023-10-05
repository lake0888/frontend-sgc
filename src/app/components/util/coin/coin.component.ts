import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';

import Coin from 'src/app/api/util/coin/coin';
import JUtil from 'src/app/api/util/jutil';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import { CoinService } from 'src/app/services/modules/coin/coin.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.css']
})
export class CoinComponent implements OnInit {
  public coinList: Array<Coin>;
  private service: CoinService;
  private coin: Coin;

  public breadcrumb: BreadCrumb;
  public alert: Alert

  public params: any;

  public columns: string[];

  public kindDelete: number;
  public modelMode: boolean;
  public titleDialog: string;

  form!: FormGroup;

  public feedBackCode: string;
  public feedBackName: string;

  constructor(private shareService: ShareService) {
    this.coinList = new Array<Coin>();
    this.service = inject(CoinService);
    this.coin = new Coin();

    this.breadcrumb = new BreadCrumb('Coin', 'Manage the coin module');
    this.breadcrumb.urls.push(new Url('Coin', 'coin'));

    this.alert = new Alert();

    this.params = { filter: '', page: 0, size: 10 };

    this.columns = ['Code', 'Name'];

    this.kindDelete = 1;
    this.modelMode = true;
    this.titleDialog = '';

    this.feedBackCode = '';
    this.feedBackName = '';
  }

  ngOnInit(): void {
    this.findAll(this.params);
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.coin.id,
      code: this.coin.code,
      name: this.coin.name
    });
  }

  public onOpenModal(coin: any, mode: string): void {
    const container = document.getElementById('coinContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    this.onCleanFeedBack();
    this.alert.onCleanAlert();

    if (mode === 'add' || mode === 'edit') {
      button.setAttribute('data-bs-target', '#editModal');

      if (mode === 'add') {
        this.coin = new Coin();
        this.modelMode = true;
        this.titleDialog = 'Add coin';
      } else {
        this.coin = coin;
        this.modelMode = false;
        this.titleDialog = 'Edit coin';
      }
      this.updateForm();
    } else if (mode === 'delete' || mode === 'deleteAll') {
      button.setAttribute('data-bs-target', '#deleteModal');

      const element = document.getElementById('message')!;
      if (mode === 'delete') {
        this.coin = coin;
        this.kindDelete = 1;
        element.innerHTML = `Are you sure you want to delete coin ${ this.coin.code }?`;
      } else {
        let cont = JUtil.getListChecked(this.coinList).length;
        this.kindDelete = 2;
        if (cont != 0) {
          let text = (cont == 1) ? 'coin' : 'coins';
          element.innerHTML = `Are you sure you want to delete ${ cont } ${ text }?`;
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't any coin selecteds`;
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
          this.coinList = response['content'];

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
          this.alert.message = `There aren't any coin`;
        }        
      }
    );
  }

  public save(): void {
    let params = this.getCoin();
    const formData: FormData = this.prepareCoin(params);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.coin = response;
        this.findAll(this.params);
        this.form.reset();

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The coin have been registered`;

        document.getElementById('edit-form')?.click();
      },
      (error: HttpErrorResponse) => {
        let message = error.error.message;
        this.updateFeedBack(message);

        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = message;
      }
    );
  }

  public updateById(): void {
    let params = this.getCoin();
    const formData: FormData = this.prepareCoin(params);

    this.service.updateById(this.coin.id, formData).subscribe(
      (response: any) => {
        this.coin = response;
        this.findAll(this.params);
        this.form.reset();

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The coin have been updated`;

        document.getElementById('edit-form')?.click();
      },
      (error: HttpErrorResponse) => {
        let message = error.error.message;
        this.updateFeedBack(message);

        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = message;
      }
    );
  }

  public deleteById(): void {
    this.service.deleteById(this.coin.id).subscribe(
      (response: any) => {
        this.coin = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The coin have been deleted`;

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
    console.log(JUtil.getListChecked(this.coinList))
    this.service.deleteAllById({ listId: JUtil.getListChecked(this.coinList) }).subscribe(
      (response: any) => {
        this.coin = response;
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The coins have been deleted`;

        document.getElementById('delete-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getCoin(): any {
    let params = {
      code: this.form.get('code')?.value,
      name: this.form.get('name')?.value
    }

    return params;
  }

  private prepareCoin(coin: any): FormData {
    const formData: FormData = new FormData();
    //ADD COIN
    formData.append(
      'coin',
      new Blob([JSON.stringify(coin)], { type: 'application/json' })
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

  public onChangePage(page: any): void {
    this.params.page = page;
    this.findAll(this.params);
  }

  public onSelectAll(flag: boolean): void {
    for (let coin of this.coinList) {
      coin.checked = flag;
    }
  }

  private updateFeedBack(message: string) {
    this.onCleanFeedBack();

    const code = document.querySelector("#editModal #code");
    code?.classList.remove('is-invalid', 'is-valid');

    const name = document.querySelector("#editModal #name");
    name?.classList.remove('is-invalid', 'is-valid');

    if (message.includes('code')){
      this.feedBackCode = message;
      code?.classList.add('is-invalid');
    } else if (message.includes('name')) {
      this.feedBackName = message;
      name?.classList.add('is-invalid');
    }

  }

  private onCleanFeedBack(): void {
    this.feedBackCode = '';
    this.feedBackName = '';
  }
}
