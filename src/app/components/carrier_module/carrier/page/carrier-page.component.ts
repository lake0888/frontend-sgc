import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import Carrier from 'src/app/api/carrier/carrier';
import Alert from 'src/app/api/util/alert';
import BreadCrumb from 'src/app/api/util/breadcrumb';
import Url from 'src/app/api/util/url';

import { CarrierService } from 'src/app/services/modules/carrier/carrier.service';

@Component({
  selector: 'app-carrier-page',
  templateUrl: './carrier-page.component.html',
  styleUrls: ['./carrier-page.component.css']
})
export class CarrierPageComponent implements OnInit {
  private route: ActivatedRoute;

  private carrierId: number;
  public carrier: Carrier;
  private service: CarrierService;

  //BREADCRUMB
  public breadcrumb!: BreadCrumb;
  //ALERT
  public alert!: Alert;

  constructor(private router: ActivatedRoute) {
    this.route = inject(ActivatedRoute);
    this.carrierId = Number(this.route.snapshot.params['id']);
   
    this.carrier = new Carrier();
    this.service = inject(CarrierService);
/*  
    this.breadcrumb.title = (this.carrierId > 0) ? 'Edit carrier' : 'Add carrier';
    this.breadcrumb.description = 'Carrier form';
    this.breadcrumb.urls.push(new Url('Carrier', 'carrier'));
    this.breadcrumb.urls.push(
      (this.carrierId > 0) 
      ? new Url('Edit', `carrier/${ this.carrierId }/edit`)
      : new Url('Add', 'carrier/add')
    );

    console.log(this.breadcrumb);
    */


    if (this.carrierId > 0) {
      /*
      this.findById(this.carrierId);
      */
    }
  }
  ngOnInit(): void {
    
  }

  private findById(carrierId: number): void {
    this.service.findById(carrierId).subscribe(
      (response: any) => {
        this.carrier = response;
      }, 
    );
  }
  
}
