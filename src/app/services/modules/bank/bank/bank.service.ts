import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService extends DataService {

  constructor(http: HttpClient) {
    super(AppConstants.BANK_API_URL, http);
  }

  public findAllBank(params: any): Observable<any> {
    return this.http.get<any>(`${ AppConstants.BANK_API_URL }/findAll`, {params});
  }
}
