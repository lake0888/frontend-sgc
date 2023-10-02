import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { AppConstants } from 'src/app/app.constants';
import { ImageService } from 'src/app/services/modules/image/image.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;

  public srcImage!: string;
  @Output() imageFile = new EventEmitter<File>;
  private imageService: ImageService;

   

  constructor(private rootFormGroup: FormGroupDirective) {
    this.imageService = inject(ImageService);
   }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
  
  public loadImage(): void {
    document.getElementById('loadImage')?.click();
  }

  public uploadImage(event: any): void {
    const imageFile = event.target.files[0];

    const formData: FormData = new FormData();
    formData.append('files', imageFile, imageFile.name);

    this.prepareImage(formData);

    this.imageFile.emit(imageFile);
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
