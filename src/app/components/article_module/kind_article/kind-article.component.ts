import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import KindArticle from 'src/app/api/article/kind_article';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import JUtil from 'src/app/api/util/jutil';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import { KindArticleService } from 'src/app/services/modules/article/kind_article/kind-article.service';
import { ImageService } from 'src/app/services/modules/image/image.service';

@Component({
  selector: 'app-kind-article',
  templateUrl: './kind-article.component.html',
  styleUrls: ['./kind-article.component.css']
})
export class KindArticleComponent {
  public kindArticleList: Array<KindArticle>;
  private service: KindArticleService;
  public kindArticle: KindArticle;

  public breadcrumb: BreadCrumb;
  public alert: Alert;

  public selectAll: boolean;
  public columns: string[];

  public params: any;

  form!: FormGroup;

  public titleDialog: string;
  public feedbackName: string;

  public modelMode: boolean;
  public kindDelete: number;

  constructor() {
    this.kindArticleList = new Array<KindArticle>();
    this.service = inject(KindArticleService);
    this.kindArticle = new KindArticle();

    this.breadcrumb = new BreadCrumb('Kind Article', 'Manage the kind article module');
    this.breadcrumb.urls.push(new Url('Kind Article', 'kind_article'));

    this.alert = new Alert();
    this.selectAll = false;
    this.columns = ['Name'];
    this.titleDialog = 'Kind Article';
    this.feedbackName = '';
    this.modelMode = false;
    this.kindDelete = 1;

    this.params = { filter: '', page: 0, size: 0 };
  }

  ngOnInit(): void {
    this.initForm();
    this.findAll(this.params);
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.kindArticle.id,
      name: this.kindArticle.name
    });
  }

  public onOpenModal(kindArticle: any, mode: string): void {
    this.alert.onCleanAlert();
    const container = document.getElementById('kindArticleContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add' || mode === 'edit') {
      button.setAttribute('data-bs-target', '#editModal');

      if (mode === 'add') {
        this.titleDialog = 'Add Kind Article';
        this.modelMode = true;
        this.kindArticle = new KindArticle();        
      } else {
        this.titleDialog = 'Edit Kind Article';
        this.modelMode = false;
        this.kindArticle = kindArticle;
        this.updateForm();
      }
    } else if (mode === 'delete' || mode === 'deleteAll') {
      button.setAttribute('data-bs-target', '#deleteModal');

      const message = document.getElementById('message')!;
      if (mode === 'delete') {
        this.kindDelete = 1;
        this.kindArticle = kindArticle;

        message.innerHTML = `Are you sure you want to delete ${ this.kindArticle.name }?`;
      } else {
        this.kindDelete = 2;

        let cont = JUtil.getListChecked(this.kindArticleList).length;
        if (cont != 0) {
          let text = (cont == 1) ? 'manufacturer' : 'manufacturers';
          message.innerHTML = `Are you sure you want to delete ${ cont } ${ text }?`;
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't any manufacturers selected`;
          return;
        }
      }
    }

    container?.appendChild(button);
    button.click();
  }

  public findAll(params: any): void {
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.kindArticleList = response['content'];
        } else {
          this.alert.kindAlert = KindAlert.Warning;
          this.alert.title = 'Warning';
          this.alert.message = `There aren't any kind articles`;
        }
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public save(): void {
    const kinArticle = this.getKindArticle();
    const formData = this.prepareKindArticle(kinArticle);
    this.service.save(formData).subscribe(
      (response: any) => {
        console.log(response);
        this.form.reset();
        this.findAll(this.params);

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
    const kinArticle = this.getKindArticle();
    const formData = this.prepareKindArticle(kinArticle);
    this.service.updateById(this.kindArticle.id, formData).subscribe(
      (response: any) => {
        console.log(response);
        this.form.reset();
        this.findAll(this.params);

        document.getElementById('edit-form')?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getKindArticle(): any {
    const kindArticle = {
      name: this.form.get('name')?.value
    }
    return kindArticle;
  }

  private prepareKindArticle(kindArticle: any): FormData {
    const formData = new FormData();

    //ADD KIND ARTICLE
    formData.append(
      'kind_article',
      new Blob([JSON.stringify(kindArticle)], { type: 'application/json' })
    );
    return formData;
  }

  public deleteById(manufacturerId: number): void {
    this.service.deleteById(this.kindArticle.id).subscribe(
      (response: any) => {
        this.findAll(this.params);

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
    this.service.deleteAllById({ listId: JUtil.getListChecked(this.kindArticleList) }).subscribe(
      (response: any) => {
        this.findAll(this.params);

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

  public onSelected(size: any): void {
    this.params.size = size as number;
    this.findAll(this.params);
  }

  public onSelectAll(flag: boolean): void {
    JUtil.onSelectAll(this.kindArticleList, flag);
  }

  public onSetPage(page: any): void {
    this.params.page = page as number;
    this.findAll(this.params);
  }
}
