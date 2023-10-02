import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';

import { SubfamilyService } from 'src/app/services/modules/article/subfamily/subfamily.service';
import { FamilyService } from 'src/app/services/modules/article/family/family.service';
import { SpecialtyService } from 'src/app/services/modules/article/specialty/specialty.service';
import { ShareService } from 'src/app/services/share.service';

import Subfamily from 'src/app/api/article/subfamily';
import Family from 'src/app/api/article/family';
import Specialty from 'src/app/api/article/specialty';
import KindAlert from 'src/app/api/util/kindalert';
import JUtil from 'src/app/api/util/jutil';
import Url from 'src/app/api/util/url';
import { ImageService } from 'src/app/services/modules/image/image.service';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Alert from 'src/app/api/util/alert';
import { AppConstants } from 'src/app/app.constants';

@Component({
  selector: 'app-subfamily',
  templateUrl: './subfamily.component.html',
  styleUrls: ['./subfamily.component.css']
})
export class SubfamilyComponent implements OnInit {
  public subfamilyList: Array<Subfamily>;
  private service: SubfamilyService;

  public familyList: Array<Family>;
  private familyService: FamilyService;

  public specialtyList: Array<Specialty>;
  private specialtyService: SpecialtyService;

  public subfamily: Subfamily;

  private imageService: ImageService;
  public srcImage!: string;
  public imageFile!: File;

  public modelMode: boolean;
  public titleDialog: string;

  //TYPE OF DELETE BUTTON
  public kindDelete: number;
  public selectAll: boolean;

  //BREADCRUMB
  public breadcrumb: BreadCrumb;
  //ALERT
  public alert: Alert;

  //FEEDBACK
  public feedBackCode: string;
  public feedBackName: string;
  public feedBackFamily: string;
  public feedBackSpecialty: string;

  //TABLE HEADER
  columns: string[];

  //SEARCH AND PAGINATION
  private params: any;

  public form!: FormGroup;

  constructor(private shareService: ShareService) {
    this.subfamilyList = new Array();
    this.service = inject(SubfamilyService);

    this.familyList = new Array();
    this.familyService = inject(FamilyService);

    this.specialtyList = new Array();
    this.specialtyService = inject(SpecialtyService);

    this.subfamily = new Subfamily();
    this.imageService = inject(ImageService);

    this.modelMode = true;
    this.titleDialog = "Add Subfamily";

    //TYPE OF DELETE BUTTON
    this.kindDelete = 0;
    this.selectAll = false;

    //BREADCRUMB
    this.breadcrumb = new BreadCrumb("Subfamily", "Manage the subfamily module");
    this.breadcrumb.urls.push(new Url('Subfamily', 'subfamily'))
    //ALERT
    this.alert = new Alert();

    //FEEDBACK
    this.feedBackCode = "";
    this.feedBackName = "";
    this.feedBackFamily = "";
    this.feedBackSpecialty = "";

    //TABLE HEADER
    this.columns = ['Code', 'Name', 'Family', 'Specialty'];

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
      specialty: new FormControl(null, Validators.required),
      family: new FormControl(null, Validators.required)
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      id: this.subfamily.id,
      code: this.subfamily.code,
      name: this.subfamily.name,
      description: this.subfamily.description,
      specialty: this.subfamily.family.specialty,
      family: this.subfamily.family
    });
  }

  public onOpenModal(subfamily: any, mode: string): void {
    const container = document.getElementById("subfamilyContainer");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute("data-bs-toggle", "modal");

    this.alert.onCleanAlert();
    this.cleanFeedBack();

    if (mode === 'add' || mode === 'edit') {
      button.setAttribute("data-bs-target", "#editModal");
      var index = 0;
      if (mode === 'add') {
        this.subfamily = new Subfamily();
        this.modelMode = true;
        this.titleDialog = "Add Subfamily";

        this.srcImage = 'assets/images/image_not_found.png';

        if (this.specialtyList.length == 0) {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = 'Info';
          this.alert.message = `There aren't any specialty with family created`
          return;
        }
      } else {
        this.subfamily = subfamily;        
        this.modelMode = false;
        this.titleDialog = "Edit Subfamily";

        //REMOVING THE EMPTY OPTION
        let indexEdit: number = JUtil.findElement(this.specialtyList, this.subfamily.family.specialty);
        index = (indexEdit != -1) ? indexEdit : 0;

        if (this.subfamily.image.filename != '')
          this.srcImage = `${ AppConstants.IMAGE_API_URL }/${ this.subfamily.image.id }`;
        else
          this.srcImage = 'assets/images/image_not_found.png';
      }

      this.updateForm();
      this.form.patchValue({
        specialty: this.specialtyList[index]
      });

      this.findAllFamiliesBySpecialty(this.specialtyList[index].id);
      
    } else if (mode === 'delete' || mode === 'deleteAll') {
      button.setAttribute("data-bs-target", "#deleteModal");
      const element = document.getElementById('message')!;

      if (mode === 'delete') {
        this.subfamily = subfamily;
        this.kindDelete = 1;
        element.innerHTML = `Are you sure you want to delete subfamily ${ this.subfamily.name }?`;
      } else {
        let cont: number = this.subfamilySelecteds().length;
        if (cont > 0) {
          this.kindDelete = 2;
          let text: string = (cont == 1) ? "subfamily" : "subfamilies";
          element.innerHTML = `Are you sure you want to delete ${ cont } ${ text } ?`;
        } else {
          this.alert.kindAlert = KindAlert.Info;
          this.alert.title = "Delete All";
          this.alert.message = "There aren't subfamilies selected";
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
          this.subfamilyList = response['content'];

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
          this.alert.title = 'Not found';
          this.alert.message = `There aren't any subfamily`;
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
    let params = this.getSubfamily();
    const formData: FormData = this.prepareFormData(params);

    this.service.save(formData).subscribe(
      (response: any) => {
        this.form.reset();
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The subfamily ${ response.name } have been registered`;

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

  public updateById(subfamilyId: number): void {
    let params = this.getSubfamily();
    const formData: FormData = this.prepareFormData(params);
    
    this.service.updateById(subfamilyId, formData).subscribe(
      (response: any) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The subfamily ${ this.subfamily.name } have been updated`;

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

  public deleteById(subfamilyId: number): void {
    this.service.deleteById(subfamilyId).subscribe(
      (response: any) => {
        this.findAll(this.params);

        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The subfamily ${ response.name } have been deleted`;

        document.getElementById("delete-form")?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  public deleteAll(): void {
    let subfamilyList = this.subfamilySelecteds();
    this.service.deleteAllById({ listId: subfamilyList }).subscribe(
      (response: any) => {  
        this.alert.kindAlert = KindAlert.Success;
        this.alert.title = "Success";
        this.alert.message = `The subfamilies have been deleted`;

        this.findAll(this.params);
        document.getElementById("delete-form")?.click();
      },
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  }

  private getSubfamily(): any {
    let params = {
      code: this.form.get('code')?.value,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      family: this.form.get('family')?.value
    }
    return params;
  }

  private prepareFormData(subfamily: any): FormData {
    const formData: FormData = new FormData();
    //ADD SUBFAMILY
    formData.append(
      'subfamily',
      new Blob([JSON.stringify(subfamily)], { type: 'application/json' })
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
              this.srcImage = `${ AppConstants.IMAGE_API_URL }/temp/${ response.body[0].filename }`;
            break;
        }
      }
    );
  }

  public onFilterChange(filter: string): void {
    this.params.filter = filter;
    this.params.page = 0;
    this.findAll(this.params);
  }

  public onSelected(size: any): void {
    this.params.size = size;
    this.findAll(this.params);
  }

  public onSetPage(page: number): void {
    this.params.page = page;
    this.findAll(this.params);
  }

  public onSelectAll(flag: boolean): void {
    for (let subfamily of this.subfamilyList) {
      subfamily.checked = flag;
    }
  }

  public subfamilySelecteds(): Array<number> {
    let selectedList: Array<number> = new Array();
    for (let subfamily of this.subfamilyList) {
      if (subfamily.checked)
        selectedList.push(subfamily.id);
    }
    return selectedList;
  }

  private updateFeedBack(message: string): void {
    this.cleanFeedBack();

    const code = document.querySelector("#editModal #code");
    code?.classList.remove("is-invalid");

    const name = document.querySelector("#editModal #name");
    name?.classList.remove("is-invalid");

    const specialty = document.querySelector("#editModal #specialty");
    specialty?.classList.remove("is-invalid");
    console.log(specialty);

    const family = document.querySelector("#editModal #family");
    family?.classList.remove("is-invalid");

    if (message.includes("code")) {
      code?.classList.add("is-invalid");
      this.feedBackCode = message;
    } else if(message.includes("name")) {          
      name?.classList.add("is-invalid");
      this.feedBackName = message;
    } else if (specialty?.textContent == '') {
      specialty.classList.add("is-invalid");
      this.feedBackSpecialty = "The field specialty cannot be empty";
    } else if (family?.textContent == '') {
      family.classList.add("is-invalid");
      this.feedBackFamily = "The field family cannot be empty";
    }
  }

  private cleanFeedBack(): void {
    this.feedBackCode = "";
    this.feedBackName = "";
    this.feedBackSpecialty = "";
    this.feedBackFamily = "";
  }

  //THE SPECIALTY MUST HAVE FAMILY
  public findAllSpecialties(): void {
    this.specialtyService.findByFamily_NotNull({ name: "" }).subscribe(
      (response: any) => {
        if (response) {
          this.specialtyList = response;
        }
      }, 
      (error: HttpErrorResponse) => {
        this.alert.kindAlert = KindAlert.Danger;
        this.alert.title = error.error.error;
        this.alert.message = error.error.message;
      }
    );
  } 

  public onChangeSpecialty(): void {
    this.findAllFamiliesBySpecialty(this.form.get('specialty')?.value.id);
  }

  public findAllFamiliesBySpecialty(specialtyId: number): void {
    this.familyService.findBySpecialtyId(specialtyId).subscribe(
      (response: any) => {
        if (response) {
          this.familyList.splice(0);
          this.familyList = response;

          //REMOVING THE EMPTY OPTION OF THE SELECT
          var indexEdit = JUtil.findElement(this.familyList, this.subfamily.family);
          var index = (indexEdit != -1) ? indexEdit : 0;

          this.form.patchValue({
            family: this.familyList[index]
          });
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
