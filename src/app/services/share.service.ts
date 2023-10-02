import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private subject: Subject<any>;

  constructor() {
    this.subject = new Subject();
  }

  sendData(params: any) {
    this.subject.next(params);
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}
