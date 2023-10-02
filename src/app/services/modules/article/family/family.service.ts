import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import { AppConstants } from 'src/app/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyService extends DataService{

  constructor(http: HttpClient) {
    super(AppConstants.FAMILY_API_URL, http);
   }

   public findBySpecialtyId(specialtyId: number): Observable<any> {
    return this.http.get<any>(`${ this.url }/familyListBySpecialty_Id/${ specialtyId }`);
   }
}
