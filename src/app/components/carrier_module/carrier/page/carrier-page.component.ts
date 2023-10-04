import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Carrier from 'src/app/api/carrier/carrier';
import KindCarrier from 'src/app/api/carrier/kindcarrier';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import { AppConstants } from 'src/app/app.constants';

import { CarrierService } from 'src/app/services/modules/carrier/carrier.service';
import { ImageService } from 'src/app/services/modules/image/image.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-carrier-page',
  templateUrl: './carrier-page.component.html',
  styleUrls: ['./carrier-page.component.css']
})
export class CarrierPageComponent implements OnInit {
  private route: ActivatedRoute;

  private carrierId: number;
  public carrier: Carrier;
  private service: CarrierService;

  public modelMode: boolean;

  //BREADCRUMB
  public breadcrumb: BreadCrumb;
  //ALERT
  public alert: Alert;

  public form!: FormGroup;

  public feedBackName: string;
  public feedBackCif: string;

  private imageFile!: File;
  public srcImage: string;
  private imageService: ImageService;

  constructor(private formBuilder: FormBuilder, private router: Router, private shareService: ShareService) {
    this.route = inject(ActivatedRoute);
    this.carrierId = Number(this.route.snapshot.params['id']);
   
    this.carrier = new Carrier();
    this.service = inject(CarrierService);

    this.imageService = inject(ImageService);
    this.srcImage = 'assets/images/image_not_found.png';

    this.breadcrumb = new BreadCrumb((this.carrierId > 0) ? 'Edit carrier' : 'Add carrier');
    this.breadcrumb.description = 'Carrier form';
    this.breadcrumb.urls.push(new Url('Carrier', 'carrier'));
    this.breadcrumb.urls.push(
      (this.carrierId > 0) 
      ? new Url('Edit', `carrier/${ this.carrierId }/edit`)
      : new Url('Add', 'carrier/add')
    );

    this.alert = new Alert();

    this.feedBackName = '';
    this.feedBackCif = '';

    if (this.carrierId > 0) {
      this.findById(this.carrierId);
      this.modelMode = false;
    } else {
      this.modelMode = true;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.form.patchValue({
      kindCarrier: KindCarrier.Multimodal
    });
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      cif: new FormControl(null),
      description: new FormControl(null),
      kindCarrier: new FormControl(null, Validators.required),
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
      id: this.carrier.id,
      name: this.carrier.name,
      cif: this.carrier.cif,
      description: this.carrier.description,
      kindCarrier: this.carrier.kindCarrier,
      address: {
        addressLine: this.carrier.address.addressLine,
        city: this.carrier.address.city,
        county: this.carrier.address.county,
        zipcode: this.carrier.address.zipcode,
        countryState: this.carrier.address.countryState
      },
      contactDetails: {
        home_phone: this.carrier.contactDetails.home_phone,
        work_phone: this.carrier.contactDetails.work_phone,
        cell_phone: this.carrier.contactDetails.cell_phone,
        email: this.carrier.contactDetails.email,
        website: this.carrier.contactDetails.website
      }
    });
  }

  private findById(carrierId: number): void {
    this.service.findById(carrierId).subscribe(
      (response: any) => {
        this.carrier = response;
        this.updateForm();
        this.shareService.sendData(this.carrier.address.countryState);

        if (this.carrier.contactDetails.image.filename != '')
          this.srcImage = `${ AppConstants.IMAGE_API_URL }/${ this.carrier.contactDetails.image.id }`;
      }, 
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;

        this.router.navigate(['/carrier']);
      }
    );
  }

  public save(): void {
    let params = this.getCarrier();
    const formData: FormData = this.prepareCarrier(params);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.carrier = response;
        this.router.navigate(['/carrier']);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The carrier ${ this.carrier.name } have been registered`;
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public updateById(): void {
    let params = this.getCarrier();
    const formData: FormData = this.prepareCarrier(params);

    this.service.updateById(this.carrier.id, formData).subscribe(
      (response: any) => {
        this.router.navigate(['/carrier']);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The carrier ${ this.carrier.name } have been updated`;
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getCarrier(): any {
    let params = {
      name: this.form.get('name')?.value,
      cif: this.form.get('cif')?.value,
      description: this.form.get('description')?.value,
      kindCarrier: this.form.get('kindCarrier')?.value,
      address: this.form.get('address')?.value,
      contactDetails: this.form.get('contactDetails')?.value
    }
    return params;
  }

  private prepareCarrier(carrier: any): FormData {
    const formData: FormData = new FormData();
    //ADD CARRIER
    formData.append(
      'carrier',
      new Blob([JSON.stringify(carrier)], { type: 'application/json' })
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
            this.srcImage = `${ AppConstants.IMAGE_API_URL }/temp/${ this.imageFile.name }`;
            break;
        }
      }
    );
  }
  
}
