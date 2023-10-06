import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Bank from 'src/app/api/bank/bank';
import Alert from 'src/app/api/util/alert';
import KindAlert from 'src/app/api/util/kindalert';
import { AppConstants } from 'src/app/app.constants';
import { BankService } from 'src/app/services/modules/bank/bank/bank.service';
import { ImageService } from 'src/app/services/modules/image/image.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-bank-page',
  templateUrl: './bank-page.component.html',
  styleUrls: ['./bank-page.component.css']
})
export class BankPageComponent implements OnInit {
  public bank: Bank;
  private service: BankService;
  private router: ActivatedRoute;

  form!: FormGroup;
  private imageFile!:File;
  public srcImage: string;
  private imageService: ImageService;

  public alert: Alert;

  public modelMode: boolean;

  constructor(private formBuilder: FormBuilder, private shareService: ShareService,
    private route: Router) {
    this.bank = new Bank();
    this.service = inject(BankService);
    this.router = inject(ActivatedRoute);
    const bankId = Number(this.router.snapshot.params['id']);

    this.srcImage = 'assets/images/image_not_found.png';
    this.imageService = inject(ImageService);
    this.alert = new Alert();

    if (bankId > 0) {
      this.findById(bankId);
      this.modelMode = false;
    } else {
      this.modelMode = true;
    }
  }

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      swift: new FormControl(null, Validators.required),
      address: new FormGroup({
        addressLine: new FormControl(null),
        city: new FormControl(null),
        county: new FormControl(null),
        zipcode: new FormControl(null),
        country: new FormControl(null, Validators.required),
        countryState: new FormControl(null, Validators.required)
      }),
      contactDetails: new FormGroup({
        work_phone: new FormControl(null),
        home_phone: new FormControl(null),
        cell_phone: new FormControl(null),
        email: new FormControl(null),
        website: new FormControl(null)
      })
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.bank.id,
      code: this.bank.code,
      name: this.bank.name,
      swift: this.bank.swift,
      address: {
        addressLine: this.bank.address.addressLine,
        city: this.bank.address.city,
        county: this.bank.address.county,
        zipcode: this.bank.address.zipcode
      },
      contactDetails: {
        work_phone: this.bank.contactDetails.work_phone,
        home_phone: this.bank.contactDetails.home_phone,
        cell_phone: this.bank.contactDetails.cell_phone,
        email: this.bank.contactDetails.email,
        website: this.bank.contactDetails.website
      }
    });
  }

  private findById(bankId: number): void {
    this.service.findById(bankId).subscribe(
      (response: any) => {
        this.bank = response;
        this.updateForm();

        this.shareService.sendData(this.bank.address.countryState);

        if (this.bank.contactDetails.image.filename != '')
          this.srcImage = `${ AppConstants.IMAGE_API_URL }/${ this.bank.contactDetails.image.id }`;
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
        this.route.navigate(['/bank']);
      }
    );
  }

  public save(): void {
    let bank = this.getBank();
    const formData = this.prepareBank(bank);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.bank = response;

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The bank ${ this.bank.code} have been registered`;
        this.route.navigate(['/bank']);
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public updateById(): void {
    let bank = this.getBank();
    const formData = this.prepareBank(bank);

    this.service.updateById(this.bank.id, formData).subscribe(
      (response: any) => {
        this.bank = response;

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = 'Success';
        this.alert.message = `The bank ${ this.bank.code} have been updated`;
        this.route.navigate(['/bank']);
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getBank(): any {
    let bank = {
      code: this.form.get('code')?.value,
      name: this.form.get('name')?.value,
      swift: this.form.get('swift')?.value,
      address: this.form.get('address')?.value,
      contactDetails: this.form.get('contactDetails')?.value
    }
    return bank;
  }

  private prepareBank(bank: any): FormData {
    const formData: FormData = new FormData();
    //ADD BANK
    formData.append(
      'bank',
      new Blob([JSON.stringify(bank)], { type: 'application/json' })
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
}
