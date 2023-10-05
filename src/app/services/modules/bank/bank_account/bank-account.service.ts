import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService extends DataService {

  constructor(http: HttpClient) {
    super(AppConstants.BANKACCOUNT_API_URL, http);
  }
}
