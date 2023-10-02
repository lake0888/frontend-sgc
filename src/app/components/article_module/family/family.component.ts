import { Component, OnInit, inject } from '@angular/core';
import { FamilyService } from 'src/app/services/modules/article/family/family.service';
import { SpecialtyService } from 'src/app/services/modules/article/specialty/specialty.service';
import { ShareService } from 'src/app/services/share.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import Family from 'src/app/api/article/family';
import Specialty from 'src/app/api/article/specialty';
import KindAlert from 'src/app/api/util/kindalert';
import JUtil from 'src/app/api/util/jutil';
import Url from 'src/app/api/util/url';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Alert from 'src/app/api/util/alert';
import { AppConstants } from 'src/app/app.constants';
import { ImageService } from 'src/app/services/modules/image/image.service';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit{
  public familyList: Array<Family>;
  private service: FamilyService;

  public specialtyList: Array<Specialty>;  
  private specialtyService: SpecialtyService;

  private imageService: ImageService;
  public srcImage!: string;
  private imageFile!: File;

  public family: Family;
  public form!: FormGroup;
  public modelMode: boolean;
  public titleDialog: string;

  //TYPE OF DELETE BUTTON
  public kindDelete: number;
  public selectAll: boolean;

  //BREADCRUMB
  breadcrumb: BreadCrumb;
  //ALERT
  alert: Alert;

  //FEEDBACK
  feedBackCode: string;
  feedBackName: string;
  feedBackSpecialty: string;

  //TABLE HEADER
  columns: string[];

  //SEARCH AND PAGINATION
  private params: any;

  constructor(private shareService: ShareService) {
    this.familyList = new Array<Family>();
    this.service = inject(FamilyService);

    this.specialtyList = new Array<Specialty>();    
    this.specialtyService = inject(SpecialtyService);

    this.imageService = inject(ImageService);

    this.family = new Family();
    this.modelMode = true;
    this.titleDialog = "Add Family";

    //TYPE OF DELETE BUTTON
    this.kindDelete = 0;
    this.selectAll = false;

    //BREADCRUMB
    this.breadcrumb = new BreadCrumb("Family", "Manage the family module");
    this.breadcrumb.urls.push(new Url('Family', 'family'));
    //ALERT
    this.alert = new Alert();

    //FEEDBACK
    this.feedBackCode = "";
    this.feedBackName = "";
    this.feedBackSpecialty = "";

    //TABLE HEADER
    this.columns = ['Code', 'Name', 'Specialty', 'Description'];

    //SEARCH AND PAGINATION
    this.params = { filter: "", page: 0, size: 10 };

    this.findAll(this.params);
    this.findAllSpecialties();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      description: new FormControl(null),
      specialty: new FormControl(null, Validators.required)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.family.id,
      code: this.family.code,
      name: this.family.name,
      description: this.family.description,
      specialty: this.family.specialty
    });
  }

  public onOpenModal(family: any, mode: string): void {
    this.alert.onCleanAlert();
    const container = document.getElementById('familyContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add' || mode === 'edit') {
      button.setAttribute('data-bs-target', "#editModal");
      var index = 0;
      if (mode === 'add') {
        this.family = new Family();
        this.modelMode = true;
        this.titleDialog ="Add Family";

        this.srcImage = 'assets/images/image_not_found.png';

        if (this.specialtyList.length == 0) {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't any specialty created`
          return;
        }
      } else {
        this.family = family;
        this.modelMode = false;
        this.titleDialog = "Edit Family";

        //INIT SELECT AND REMOVE OPTION EMPTY
        var indexEdit = JUtil.findElement(this.specialtyList, this.family.specialty);
        index = (indexEdit != 0) ? indexEdit : 0;

        //IMAGE
        if (this.family.image.filename != '')
          this.srcImage = `${ AppConstants.IMAGE_API_URL }/${ this.family.image.id }`
        else
          this.srcImage = 'assets/images/image_not_found.png';        
      }
      this.updateForm();
      //INIT SELECT AND REMOVE OPTION EMPTY      
      this.form.patchValue({
        specialty: this.specialtyList[index]
      });
    } else if (mode === 'delete' || mode === 'deleteAll') {      
      button.setAttribute('data-bs-target', "#deleteModal");

      const element = document.getElementById('message')!;
      if (mode === 'delete') {
        this.family = family;
        this.kindDelete = 1;
        element.innerHTML = `Are you sure you want to delete family ${ family.name }?`;
      } else {
        let cont: number = this.familySelecteds().length;
        if (cont > 0) {
          this.kindDelete = 2;
          let text: string = (cont == 1) ? 'family' : 'families';
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

  //SPECIALTIES
  private findAllSpecialties(): void {
    this.specialtyService.findAllByName("").subscribe(
      (response: any) => {
        if (response) {
          this.specialtyList = response['content'];
        }
      }
    );
  }

  //CRUD
  //FIND ALL
  private findAll(params: any) {
    this.cleanFeedBack();
    this.alert.onCleanAlert();
    this.service.findAll(params).subscribe(
      (response: any) => {
        if (response) {
          this.familyList = response['content'];

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
          this.alert.message = "There aren't any family";
        }
    }, (error: HttpErrorResponse) => {
      this.alert.kindAlert = KindAlert.Danger;
      this.alert.title = error.error.error;
      this.alert.message = error.error.message;
    }
    );
  }

  //ADD FAMILY
  public save(): void {
    let params = this.getFamily();
    const formData = this.prepareFormData(params);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.findAll(this.params);
        this.form.reset();

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The family ${ response.name } have been registered`;
        document.getElementById("edit-form")?.click();
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

  //EDIT FAMILY
  public updateById(familyId: number): void {
    let params = this.getFamily();
    const formData = this.prepareFormData(params);
    
    this.service.updateById(familyId, formData).subscribe(
      (response: Family) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The family ${ response.name } have been updated`;
        document.getElementById("edit-form")?.click();
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

  //DELETE FAMILY
  public deleteById(familyId: number): void {
    document.getElementById("delete-form")?.click();
    this.service.deleteById(familyId).subscribe(
      (response: any) => {
        let name = response['name'];
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The family ${ name }  have been deleted`;
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
    let familyList = this.familySelecteds();
    this.service.deleteAllById({ listId: familyList }).subscribe(
      (reponse: void) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = "The families have been deleted";
        
        document.getElementById("delete-form")?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getFamily(): any {
    let params = {
      code: this.form.get('code')?.value,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      specialty: this.form.get('specialty')?.value
    };
    return params;
  }

  private prepareFormData(family: any): FormData {
    const formData: FormData = new FormData();
    //ADD FAMILY
    formData.append(
      'family',
      new Blob([JSON.stringify(family)], { type: 'application/json' })
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
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  onFilterChange(filter: string) {
    this.params.filter = filter;
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
    for (let family of this.familyList) {
      family.checked = value;
    }
  }

  public familySelecteds(): Array<number> {
    let familyList = new Array<number>();
    for (let family of this.familyList) {
      if (family.checked)
        familyList.push(family.id);
    }
    return familyList;
  }

  private updateFeedBack(message: string): void {
    this.cleanFeedBack();
    const code = document.querySelector("#editModal #code");
    code?.classList.remove("is-invalid");

    const name = document.querySelector("#editModal #name")
    name?.classList.remove("is-invalid");

    if (message.includes("code")) {
      code?.classList.add("is-invalid");
      this.feedBackCode = message;
    } else if(message.includes("name")) {          
      name?.classList.add("is-invalid");
      this.feedBackName = message;
    }
  }

  private cleanFeedBack(): void {
    this.feedBackCode = "";
    this.feedBackName = "";
    this.feedBackSpecialty = "";
  }
}
