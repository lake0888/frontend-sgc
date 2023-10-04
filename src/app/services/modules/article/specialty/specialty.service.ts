import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constants';
import { DataService } from '../../data.service'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService extends DataService {

  constructor(http: HttpClient) { 
    super(AppConstants.SPECIALTY_API_URL, http);
  }

  public findAllByName(name: string): Observable<any> {
    return this.http.get<any>(`${ this.url }/findAll/${ name }`);
  }

  public findByFamily_NotNull(params: any): Observable<any> {
    return this.http.get<any>(`${ this.url }/findByFamily_NotNull`, {params});
  }
}
