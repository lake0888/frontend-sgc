import { Component, Input, OnInit } from '@angular/core';
import Url from 'src/app/api/util/url';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  @Input() title: string;
  @Input() desription: string;
  @Input() urls: Array<Url>;

  constructor() {
    this.title = '';
    this.desription = '';
    this.urls = new Array<Url>;
  }

  ngOnInit(): void {

  }
}
