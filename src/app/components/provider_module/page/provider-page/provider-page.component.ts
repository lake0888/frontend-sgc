import { Component, OnInit, inject } from '@angular/core';
import { ProviderService } from 'src/app/services/modules/provider/provider.service';

import Provider from 'src/app/api/provider/provider';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/modules/image/image.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { AppConstants } from 'src/app/app.constants';
import Alert from 'src/app/api/util/alert';
import KindAlert from 'src/app/api/util/kindalert';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-provider-page',
  templateUrl: './provider-page.component.html',
  styleUrls: ['./provider-page.component.css']
})
export class ProviderPageComponent implements OnInit {
  public provider: Provider;
  private service: ProviderService;

  public srcImage: string;
  private imageFile!: File;
  private imageService: ImageService;

  form!: FormGroup;

  public alert: Alert;

  private route: ActivatedRoute;

  public modelMode!: boolean;

  constructor(private formBuilder: FormBuilder, private shareService: ShareService,
    private router: Router) {
    this.provider = new Provider();
    this.service = inject(ProviderService);

    this.srcImage = 'assets/images/image_not_found.png';
    this.imageService = inject(ImageService);

    this.alert = new Alert();

    this.route = inject(ActivatedRoute);
    const providerId = Number(this.route.snapshot.params['id']);

    if (providerId > 0) {
      this.findById(providerId);
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
      cif: new FormControl(null),
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
      name: this.provider.name,
      cif: this.provider.cif,
      description: this.provider.description,
      address: {
        addressLine: this.provider.address.addressLine,
        city: this.provider.address.city,
        county: this.provider.address.county,
        zipcode: this.provider.address.zipcode,
        country: this.provider.address.countryState.country,
        countryState: this.provider.address.countryState
      },
      contactDetails: {
        home_phone: this.provider.contactDetails.home_phone,
        work_phone: this.provider.contactDetails.work_phone,
        cell_phone: this.provider.contactDetails.cell_phone,
        email: this.provider.contactDetails.email,
        website: this.provider.contactDetails.website
      }
    });
  }

  private findById(providerId: number): void {
    this.service.findById(providerId).subscribe(
      (response: any) => {
        if (response) {
          this.provider = response;
          this.updateForm();

          this.shareService.sendData(this.provider.address.countryState);

          if (this.provider.contactDetails.image.filename != '')
            this.srcImage = `${ AppConstants.IMAGE_API_URL }/${ this.provider.contactDetails.image.id }`;
        } else {
          this.router.navigate(['/provider']);
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
    let provider = this.getProvider();
    const formData: FormData = this.prepareProvider(provider);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.provider = response;

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = 'The provider have been registered';

        this.router.navigate(['/provider']);
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public updateById(): void {
    let provider = this.getProvider();
    const formData: FormData = this.prepareProvider(provider);

    this.service.updateById(this.provider.id, formData).subscribe(
      (response: any) => {
        this.provider = response;

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = 'The provider have been updated';

        this.router.navigate(['/provider']);
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getProvider(): any {
    let provider = {
      name: this.form.get('name')?.value,
      cif: this.form.get('cif')?.value,
      description: this.form.get('description')?.value,
      address: this.form.get('address')?.value,
      contactDetails: this.form.get('contactDetails')?.value
    };
    return provider;
  }

  private prepareProvider(provider: any): FormData {
    const formData: FormData = new FormData();
    //ADD PROVIDER
    formData.append(
      'provider',
      new Blob([JSON.stringify(provider)], { type: 'application/json' })
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

  public updateImage(event: any): void {
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
            this.srcImage = `${ AppConstants.IMAGE_API_URL }/temp/${ this.imageFile.name }`;
            break;
        }
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }
}
