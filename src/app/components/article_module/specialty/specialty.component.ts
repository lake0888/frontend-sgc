import { Component, OnInit, inject } from '@angular/core';
import { SpecialtyService } from 'src/app/services/modules/article/specialty/specialty.service';
import { ShareService } from 'src/app/services/share.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

import Specialty from 'src/app/api/article/specialty';
import KindAlert from 'src/app/api/util/kindalert';
import Url from 'src/app/api/util/url';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Alert from 'src/app/api/util/alert';
import { AppConstants } from 'src/app/app.constants';
import { ImageService } from 'src/app/services/modules/image/image.service';

@Component({
  selector: 'app-specialty',
  templateUrl: './specialty.component.html',
  styleUrls: ['./specialty.component.css']
})
export class SpecialtyComponent implements OnInit {
  public specialtyList: Array<Specialty>;
  private service: SpecialtyService;
  private imageService: ImageService;

  public specialty: Specialty;
  private imageFile!: File;

  form!: FormGroup;

  public modelMode: boolean; //TRUE CREATE, FALSE EDIT
  public titleDialog: string;

  //TYPE OF DELETE BUTTON
  public kindDelete: number;
  public selectAll: boolean;

  //BREADCRUMB
  public breadcrumb: BreadCrumb;
  //ALERT
  public alert: Alert;

  //FEEDBACK
  feedbackCode: string;
  feedbackName: string;

  //TABLE HEADER
  columns: string[];

  //SEARCH AND PAGINATION
  private params: any;

  public srcImage!: string;

  constructor(private shareService: ShareService) {
    this.specialtyList = new Array<Specialty>();
    this.service = inject(SpecialtyService);
    this.imageService = inject(ImageService);
    
    this.specialty = new Specialty();

    this.modelMode = true;
    this.titleDialog = "Add Specialty";    

    //TYPE OF DELETE BUTTON
    this.kindDelete = 0;
    this.selectAll = false;

    //BREADCRUMB
    this.breadcrumb = new BreadCrumb("Specialty", "Manage the specialty module");
    this.breadcrumb.urls.push(new Url('Specialty', 'specialty'));
    //ALERT
    this.alert = new Alert();
    //FEEDBACK
    this.feedbackCode = "";
    this.feedbackName = "";
    //TABLE HEADER
    this.columns = ['Code', 'Name', 'Description'];
    //SEARCH AND PAGINATION
    this.params = { filter: "", page: 0, size: 10 }
    this.findAll(this.params)
  }

  ngOnInit(): void { 
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      description: new FormControl(null)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.specialty.id,
      code: this.specialty.code,
      name: this.specialty.name,
      description: this.specialty.description
    });
  }

  public onOpenModal(specialty: any, mode: string): void {
    const container = document.getElementById('specialtyContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    this.onCleanFeedBack();

    if (mode === 'add' || mode === 'edit') {
      button.setAttribute('data-bs-target', "#editModal");
      if (mode === 'add') {

        this.specialty = new Specialty();
        this.modelMode = true;
        this.titleDialog = "Add Specialty";
        this.srcImage = 'assets/images/image_not_found.png';
        this.imageFile = new File([], '');

      } else if (mode === 'edit') {

        this.specialty = specialty;
        this.modelMode = false;
        this.titleDialog = "Edit Specialty";
        
        if (this.specialty.image.filename != '')
          this.srcImage = `${ AppConstants.IMAGE_API_URL }/${ this.specialty.image.id }`;
        else 
          this.srcImage = 'assets/images/image_not_found.png';
      }
      this.updateForm();
    } else if (mode === 'delete' || mode === 'deleteAll') {      
      button.setAttribute('data-bs-target', "#deleteModal");

      const element = document.getElementById('message')!;
      if (mode === 'delete') {
        this.specialty = specialty;
        this.kindDelete = 1;
        element.innerHTML = `Are you sure you want to delete specialty ${ specialty.name }?`;
      } else {
        let cont: number = this.specialtySelecteds().length;
        if (cont > 0) {
          this.kindDelete = 2;
          let text: string = (cont == 1) ? 'specialty' : 'specialties';
          element.innerHTML = `Are you sure you want to delete ${ cont } ${ text }`;
        } else { 
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = "Info"
          this.alert.message = "There aren't items selected";
          return;
         }
      }
    }
    container?.appendChild(button);
    button.click();
  }

  //CRUD
  //FIND ALL
  private findAll(params: any) {
    this.onCleanFeedBack();
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.specialtyList = response['content'];

          let params: any = {
            first: response['first'],
            last: response['last'],
            page: response['number'],
            numberOfElements: response['numberOfElements'],
            size: response['size'],
            totalElements: response['totalElements'],
            totalPages: response['totalPages']
          }

          this.shareService.sendData(params);
          this.selectAll = false;
        } else {
          this.alert.kindAlert = KindAlert.Warning;
          this.alert.title = "Not found";
          this.alert.message = "There aren't any specialty";
        }
      }, 
    (error: HttpErrorResponse) => {
      this.alert.kindAlert = KindAlert.Danger;
      this.alert.title = error.error.error;
      this.alert.message = error.error.message;
    }
    );
  }

  //ADD SPECIALTY
  public save(): void {
    let params = this.getSpecialty();
    const formData: FormData = this.prepareFormData(params);
    
    this.service.save(formData).subscribe(
      (response: Specialty) => {
        if (response) {
          this.findAll(this.params);
          this.form.reset();

          this.alert.kindAlert = KindAlert.Success;
          this.alert.title = "Success";
          this.alert.message = `The specialty ${ response.name} have been registered`;
          document.getElementById("edit-form")?.click();
        }
      },
      (error: HttpErrorResponse) => {
        let message = error.error.message;
        this.updateFeedBack(message);

        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  //EDIT SPECIALTY
  public updateById(): void {
    let params = this.getSpecialty();
    const formData: FormData = this.prepareFormData(params);
    
    this.service.updateById(this.specialty.id, formData).subscribe(
      (response: Specialty) => {
        if (response) {
          this.findAll(this.params);

          this.alert.kindAlert = KindAlert.Success;
          this.alert.title = "Success";
          this.alert.message = `The specialty ${ response.name } have been updated`;
          document.getElementById("edit-form")?.click();
        }
      },
      (error: HttpErrorResponse) => {
        let message = error.error.message;
        this.updateFeedBack(message);
        
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  //DELETE SPECIALTY
  public deleteById(specialtyId: number): void {
    document.getElementById("delete-form")?.click();
    this.service.deleteById(specialtyId).subscribe(
      (response: any) => {
        if (response) {
          let name = response['content'];
          this.findAll(this.params);

          this.alert.kindAlert = KindAlert.Success;
          this.alert.title = "Success";
          this.alert.message = `The specialty ${ name } have been deleted`;
        }
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );    
  }

  //DELETE ALL
  public deleteAll(): void {
    let specialtyList: any = this.specialtySelecteds();
    this.service.deleteAllById({ listId: specialtyList }).subscribe(
      (response: any) => {
        if (response) {
          console.log(response);
          this.alert.kindAlert = KindAlert.Success;
          this.alert.title = "Success";
          this.alert.message = `The specialties have been deleted`;

          this.findAll(this.params);
          document.getElementById("delete-form")?.click();
        }
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getSpecialty(): any {
    let params = {
      code: this.form.get('code')?.value,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value
    };
    return params;
  }

  private prepareFormData(specialty: any): FormData {
    const formData = new FormData();
    //ADD SPECIALTY
    formData.append(
      'specialty',
      new Blob([JSON.stringify(specialty)], { type: 'application/json' })
    );
    //ADD IMAGE
    if (this.imageFile)
      formData.append('imageFile', this.imageFile, this.imageFile.name);
    else
      formData.append('imageFile', new File([], ''), '');
    return formData;
  }

  public updateImage(): void {
   document.getElementById('loadImage')?.click();
  }

  public prepareFile(event: any): void {
    this.imageFile = event.target.files[0];

    const formData: FormData = new FormData();
    formData.append('files', this.imageFile, this.imageFile.name);

    this.uploadFile(formData);
  }

  private uploadFile(formData: FormData): void {
    this.imageService.uploadFiles(formData).subscribe(  
      (response: HttpEvent<any>) => {
        switch(response.type) {
          case HttpEventType.Response: 
            let filename = response.body[0].filename;
            this.srcImage = `${ AppConstants.IMAGE_API_URL }/temp/${ filename }`;    
            break;
        }
          
        
      }, (error: HttpErrorResponse) => {
          this.alert.kindAlert = KindAlert.Danger;
          this.alert.title = error.error.error;
          this.alert.message = error.error.message;
      }
    );
  }

  onFilterChange(filter: string): void {
    this.params.name = filter;
    this.params.page = 0;
    this.findAll(this.params);
  }

  onSelected(size: any): void {
    this.params.size = size;
    this.findAll(this.params);
  }

  onSetPage(page: number): void {
    this.params.page = page;
    this.findAll(this.params);
  }

  public onSelectAll(value: boolean): void {
    for (let specialty of this.specialtyList) {
      specialty.checked = value;
    }
  }

  public specialtySelecteds(): Array<number> {
    let specialtyList = new Array<number>();
    for (let specialty of this.specialtyList) {
      if (specialty.checked)
        specialtyList.push(specialty.id);
    }
    return specialtyList;
  }

  private updateFeedBack(message: string) {
    this.onCleanFeedBack();

    const code = document.querySelector("#editModal #code");
    code?.classList.remove("is-invalid");

    const name = document.querySelector("#editModal #name")
    name?.classList.remove("is-invalid");

    if (message.includes("code")) {
      code?.classList.add("is-invalid");
      this.feedbackCode = message;
    } else if(message.includes("name")) {          
      name?.classList.add("is-invalid");
      this.feedbackName = message;
    }
  }

  private onCleanFeedBack(): void {
    this.feedbackCode = "";
    this.feedbackName = "";
  }
}

