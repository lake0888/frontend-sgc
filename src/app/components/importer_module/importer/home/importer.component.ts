import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import KindAlert from 'src/app/api/util/kindalert';
import Importer from '../../../../api/importer/importer';

import { ShareService } from 'src/app/services/share.service';
import { ImporterService } from 'src/app/services/modules/importer/importer.service';
import Url from 'src/app/api/util/url';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Alert from 'src/app/api/util/alert';

@Component({
  selector: 'app-importer',
  templateUrl: './importer.component.html',
  styleUrls: ['./importer.component.css']
})
export class ImporterComponent implements OnInit{
  public importerList: Array<Importer>;
  private service: ImporterService;

  public importer: Importer;
  public kindDelete: number;

  //BREADCRUMB
  public breadcrumb: BreadCrumb;
  //ALERT
  public alert: Alert;

  //TABLE HEADER
  public columns: string[];

  //SEARH AND PAGINATION
  public params: any;

  constructor(private shareService: ShareService) {
    this.importerList = new Array<Importer>();
    this.service = inject(ImporterService);

    this.importer = new Importer();

    this.kindDelete = 1;

    //BREADCRUMB
    this.breadcrumb = new BreadCrumb("Importer", "Manage the importer module");
    this.breadcrumb.urls.push(new Url('Importer', 'importer'));
    //ALERT
    this.alert = new Alert();

    //TABLE HEADER
    this.columns = ['Name', 'Address', 'Phone', 'Email'];

    //SEARCH AND PAGINATION
    this.params = { filter: "", page: 0, size: 10 };
    this.findAll(this.params);
  }

  ngOnInit(): void { }

  public onOpenModal(importer: any, mode: string): void {

    const container = document.getElementById('importerContainer');
    if (mode === 'add' || mode === 'edit') {
      const tag_a = document.createElement('a');
      tag_a.style.display = 'none';
      if (mode === 'add') {
        this.importer = new Importer();
        tag_a.href = 'importer/add';
      } else {
        this.importer = importer;
        tag_a.href = `importer/${ this.importer.id }/edit`;
      }
      container?.appendChild(tag_a);
      tag_a.click();
    } else {      
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#deleteModal');

      const element = document.getElementById('message')!;
      if (mode === 'delete') {
        this.importer = importer;
        this.kindDelete = 1;
        element.innerHTML = `Are you sure you want to delete importer ${ this.importer.name }?`;
      } else {
        this.kindDelete = 2;
        let cont = this.importerSelecteds().length;
        if (cont > 0) {
          let text = (cont == 1) ? 'importer' : 'importers';
          element.innerHTML = `Are you sure you want to delete ${ cont } ${ text }?`;
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = "Info";
          this.alert.message = "There aren't any importer selecteds";
          return;
        }
      }
      container?.appendChild(button);
      button.click();
    }
  }

  public findAll(params: any): void {
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.importerList = response['content'];
          let params = {
            first: response['first'],
            last: response['last'],
            page: response['number'],
            numberOfElements: response['numberOfElements'],
            size: response['size'],
            totalElemnts: response['totalElements'],
            totalPages: response['totalPages']
          };

          this.shareService.sendData(params);
        } else {
          this.alert.kindAlert = KindAlert.Warning;
          this.alert.title = "Not found";
          this.alert.message = "There aren't any importers";
        }
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteById(): void {
    this.service.deleteById(this.importer.id).subscribe(
      (response: any) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The importer ${ this.importer.name } have been deleted`;
        document.getElementById('delete-form')?.click();
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteAll(): void {
    var importerList = this.importerSelecteds();
    this.service.deleteAllById({ listId: importerList }).subscribe(
      (response: any) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The importers have been deleted`;
        document.getElementById('delete-form')?.click();
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public onSizePageChange(size: any): void {
    this.params.size = size;
    this.findAll(this.params);
  }

  public onFilterChange(filter: string): void {
    this.params.filter = filter;
    this.findAll(this.params);
  }

  public onPageChange(page: any): void {
    this.params.page = page as number;
    this.findAll(this.params);
  }

  public onSelectAll(flag: boolean): void {
    for (let importer of this.importerList) {
        importer.checked = flag;
    }
  }

  public importerSelecteds(): Array<number> {
    var importerList = new Array<number>();
    for (let importer of this.importerList) {
      if (importer.checked)
        importerList.push(importer.id);
    }
    return importerList;
  }
}
