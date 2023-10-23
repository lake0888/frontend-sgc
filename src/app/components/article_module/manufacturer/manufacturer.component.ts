import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Manufacturer from 'src/app/api/article/manufacturer';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import JUtil from 'src/app/api/util/jutil';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import { AppConstants } from 'src/app/app.constants';
import { ManufacturerService } from 'src/app/services/modules/article/manufacturer/manufacturer.service';
import { ImageService } from 'src/app/services/modules/image/image.service';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrls: ['./manufacturer.component.css']
})
export class ManufacturerComponent implements OnInit {
  public manufacturerList: Array<Manufacturer>;
  private service: ManufacturerService;
  public manufacturer: Manufacturer;

  public breadcrumb: BreadCrumb;
  public alert: Alert;

  public selectAll: boolean;
  public columns: string[];

  public params: any;

  form!: FormGroup;

  public titleDialog: string;
  public feedbackName: string;
  
  private imageFile!:File;
  public srcImage: string;
  private imageService: ImageService;

  public modelMode: boolean;
  public kindDelete: number;

  constructor() {
    this.manufacturerList = new Array<Manufacturer>();
    this.service = inject(ManufacturerService);
    this.manufacturer = new Manufacturer();

    this.breadcrumb = new BreadCrumb('Manufacturer', 'Manage the manufacturer module');
    this.breadcrumb.urls.push(new Url('Manufacturer', 'manufacturer'));

    this.alert = new Alert();
    this.selectAll = false;
    this.columns = ['Name'];
    this.titleDialog = 'Manufacturer';
    this.feedbackName = '';
    this.modelMode = false;
    this.kindDelete = 1;

    this.imageService = inject(ImageService);

    this.srcImage = 'assets/images/image_not_found.png';

    this.params = { filter: '', page: 0, size: 0 };
  }

  ngOnInit(): void {
    this.initForm();
    this.findAll(this.params);
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      image: new FormControl(null)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.manufacturer.id,
      name: this.manufacturer.name
    });
  }

  public onOpenModal(manufacturer: any, mode: string): void {
    this.alert.onCleanAlert();
    const container = document.getElementById('manufacturerContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add' || mode === 'edit') {
      button.setAttribute('data-bs-target', '#editModal');

      if (mode === 'add') {
        this.titleDialog = 'Add Manufacturer';
        this.modelMode = true;
        this.manufacturer = new Manufacturer();        
      } else {
        this.titleDialog = 'Edit Manufacturer';
        this.modelMode = false;
        this.manufacturer = manufacturer;
        this.updateForm();
        
        if (this.manufacturer.image.filename != '') {
          this.srcImage = `${ AppConstants.IMAGE_API_URL }/${ this.manufacturer.image.id }`;
        } else {
          this.srcImage = 'assets/images/image_not_found.png';
        }
      }
    } else if (mode === 'delete' || mode === 'deleteAll') {
      button.setAttribute('data-bs-target', '#deleteModal');

      const message = document.getElementById('message')!;
      if (mode === 'delete') {
        this.kindDelete = 1;
        this.manufacturer = manufacturer;

        message.innerHTML = `Are you sure you want to delete ${ this.manufacturer.name }?`;
      } else {
        this.kindDelete = 2;

        let cont = JUtil.getListChecked(this.manufacturerList).length;
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
          this.manufacturerList = response['content'];
        } else {
          this.alert.kindAlert = KindAlert.Warning;
          this.alert.title = 'Warning';
          this.alert.message = `There aren't any manufacturers`;
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
    const manufacturer = this.getManufacturer();
    const formData = this.prepareManufacturer(manufacturer);
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
    const manufacturer = this.getManufacturer();
    const formData = this.prepareManufacturer(manufacturer);
    this.service.updateById(this.manufacturer.id, formData).subscribe(
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

  private getManufacturer(): any {
    const manufacturer = {
      name: this.form.get('name')?.value
    }
    return manufacturer;
  }

  private prepareManufacturer(manufacturer: any): FormData {
    const formData = new FormData();

    //ADD MANUFACTURER
    formData.append(
      'manufacturer',
      new Blob([JSON.stringify(manufacturer)], { type: 'application/json' })
    );

    //ADD IMAGE
    if (this.imageFile) {
      formData.append('imageFile', this.imageFile, this.imageFile.name);
    } else {
      formData.append('imageFile', new File([], ''), '');
    }
    return formData;
  }

  public deleteById(manufacturerId: number): void {
    this.service.deleteById(this.manufacturer.id).subscribe(
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
    this.service.deleteAllById({ listId: JUtil.getListChecked(this.manufacturerList) }).subscribe(
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

  public loadImage(): void {
    document.getElementById('loadImage')?.click();
  }

  public updateImage(event: any): void {
    this.imageFile = event.target.files[0];

    const formData = new FormData();
    formData.append('files', this.imageFile, this.imageFile.name);

    this.prepareImage(formData);
  }

  private prepareImage(formData: FormData): void {
    this.imageService.uploadFiles(formData).subscribe(
      (response: HttpEvent<any>) => {
        switch(response.type) {
          case HttpEventType.Response:
            this.srcImage = `${ AppConstants.IMAGE_API_URL }/temp/${ this.imageFile.name }`;
            break;
        }
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
    JUtil.onSelectAll(this.manufacturerList, flag);
  }

  public onSetPage(page: any): void {
    this.params.page = page as number;
    this.findAll(this.params);
  }
}
