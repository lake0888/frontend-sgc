import { Component, OnInit, TemplateRef } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ShareService } from 'src/app/services/share.service';

declare var $: any;//To use JQuery

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [SidebarComponent]
})
export class HeaderComponent implements OnInit{

  constructor(private shareService: ShareService) {  
  }

  ngOnInit(): void {
  }

  toogleSidebar(): void {
  }
}
