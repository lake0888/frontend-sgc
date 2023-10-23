import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends DataService {

  constructor(http: HttpClient) {
    super(AppConstants.ARTICLE_API_URL, http);
  }
}
