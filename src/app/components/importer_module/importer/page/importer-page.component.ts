import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ImporterService } from 'src/app/services/modules/importer/importer.service';

import Importer from 'src/app/api/importer/importer';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import { ShareService } from 'src/app/services/share.service';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Alert from 'src/app/api/util/alert';
import { ImageService } from 'src/app/services/modules/image/image.service';
import { AppConstants } from 'src/app/app.constants';

@Component({
  selector: 'app-importer-page',
  templateUrl: './importer-page.component.html',
  styleUrls: ['./importer-page.component.css']
})
export class ImporterPageComponent implements OnInit {
  private route: ActivatedRoute;
  public importer: Importer;
  private service: ImporterService;

  form!: FormGroup;
  public imageFile!: File;
  private imageService: ImageService;
  public srcImage: string;

  public modelMode: boolean;

  //BREADCRUMB
  public breadcrumb: BreadCrumb;
  //ALERT
  public alert: Alert;

  //FEEDBACK
  public feedBackName: string;
  public feedBackNit: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private shareService: ShareService) {
    this.route = inject(ActivatedRoute);
    const importerId = Number(this.route.snapshot.params['id']);

    this.importer = new Importer();
    this.service = inject(ImporterService);

    this.imageService = inject(ImageService);
    this.srcImage = 'assets/images/image_not_found.png'

    //BREADCRUMB
    this.breadcrumb = new BreadCrumb(
      (importerId > 0) ? 'Edit Importer' : 'Add Importer',
      'Importer Dialog');
    this.breadcrumb.urls.push(new Url('Importer', 'importer'));
    this.breadcrumb.urls.push((importerId > 0) ? new Url('edit', `importer/${ importerId }/edit`) : new Url('add', 'importer/add'));

    //ALERT
    this.alert = new Alert();

    //FEEDBACK
    this.feedBackName = "";
    this.feedBackNit = "";

    if (importerId > 0) {
      this.findById(importerId);
      this.modelMode = false;        
    } else {
      this.modelMode = true;
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      nit: new FormControl(null),
      description: new FormControl(null),
      address: new FormGroup({
        addressLine: new FormControl(null),
        city: new FormControl(null),
        county: new FormControl(null),
        zipcode: new FormControl(null),
        country: new FormControl(null, Validators.required),
        countryState: new FormControl(null, Validators.required)
      }),
      contactDetails: new FormGroup({
        home_phone: new FormControl(null),
        work_phone: new FormControl(null),
        cell_phone: new FormControl(null),
        email: new FormControl(null),
        website: new FormControl(null)
      })
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.importer.id,
      name: this.importer.name,
      nit: this.importer.nit,
      description: this.importer.description,
      address: {
        addressLine: this.importer.address.addressLine,
        city: this.importer.address.city,
        county: this.importer.address.county,
        zipcode: this.importer.address.zipcode,
        countryState: this.importer.address.countryState
      },
      contactDetails: {
        home_phone: this.importer.contactDetails.home_phone,
        work_phone: this.importer.contactDetails.work_phone,
        cell_phone: this.importer.contactDetails.cell_phone,
        email: this.importer.contactDetails.email,
        website: this.importer.contactDetails.website
      }
    });
  }

  private findById(importerId: number): void {
    this.service.findById(importerId).subscribe(
      (response: any) => {
        this.importer = response;

        this.updateForm();
        this.shareService.sendData(this.importer.address.countryState);

        if (this.importer.contactDetails.image.filename != '')
          this.srcImage = `${ AppConstants.IMAGE_API_URL }/${ this.importer.contactDetails.image.id }`;

      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Warning;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;

        this.router.navigate(['/importer']);
      }
    );
  }

  public save(): void {
    let params = this.getImporter();
    const formData: FormData = this.prepareFormData(params);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.importer = response;
        this.form.reset();

        this.alert.kindAlert = KindAlert.Success
        this.alert.title = "Success";
        this.alert.message = `The importer ${this.importer.name} have been registered`;
        this.router.navigate(['/importer']);
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public updateById(): void {
    let params = this.getImporter();
    const formData: FormData = this.prepareFormData(params);

    this.service.updateById(this.importer.id, formData).subscribe(
      (response: any) => {
        this.importer = response;

        this.alert.kindAlert = KindAlert.Success
        this.alert.title = "Success";
        this.alert.message = `The importer ${this.importer.name} have been updated`;
        this.router.navigate(['/importer']);
      }, (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getImporter(): any {
    let params = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      nit: this.form.get('nit')?.value,
      address: this.form.get('address')?.value,
      contactDetails: this.form.get('contactDetails')?.value
    }
    return params;
  }

  private prepareFormData(importer: any): FormData {
    const formData = new FormData();

    //ADD IMPORTER
    formData.append(
      'importer',
      new Blob([JSON.stringify(importer)], { type: 'application/json' })
    );

    //ADD IMAGE
    if (this.imageFile)
      formData.append('imageFile', this.imageFile, this.imageFile.name);
    else
      formData.append('imageFile', new File([], ''), '');

    return formData;
  }


  public loadImage(): void {
    document.getElementById('loadImage')?.click();
  }

  public uploadImage(event: any): void {
    this.imageFile = event.target.files[0];

    const formData: FormData = new FormData();
    formData.append('files', this.imageFile, this.imageFile.name);

    this.prepareImage(formData);
  }

  private prepareImage(formData: FormData): void {
    this.imageService.uploadFiles(formData).subscribe(
      (response: HttpEvent<any>) => {
        switch(response.type) {
          case HttpEventType.Response:
              this.srcImage = `${ AppConstants.IMAGE_API_URL }/temp/${ response.body[0].filename }`;
            break;
        }
      }
    );
  }
}

